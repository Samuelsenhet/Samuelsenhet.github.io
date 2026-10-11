'use client';

/**
 * The home page's 3D figure, ported from dayinji/sen-3d-resume
 * web/src/scene/Scene.tsx and App.tsx (MIT License, Copyright (c) 2026 Sen
 * Zheng (SEN)) to plain three.js, without react-three-fiber.
 *
 * Kept from sen: eyes that follow the pointer, the camera orbiting the focus
 * a few degrees with the pointer, scroll moving the camera from stop to stop
 * with a dwell at each, depth of field then bloom then SMAA, his lights.
 * The model is the owner's own (public/models/me.glb, made in Hyper3D, D-003);
 * its eyes are meshes named eye-*, and focus-1… are the stops. The camera path is
 * computed from the front: the file's own CameraAction starts behind the head.
 *
 * Values were tuned by eye in scratch/home-3d.html; each says where it came from.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from 'postprocessing';

const MODEL_URL = '/models/me.glb';
const GROUND = '#0f1620'; // app/globals.css .dark --color-ground

// Eyes (Scene.tsx eye.*)
const EYE_GAIN = 3;
const EYE_MAX_YAW = 15;
const EYE_MAX_PITCH = 8;
const EYE_SMOOTH = 0.44;
const EYE_CROSS = 45;
const EYE_CROSS_RADIUS = 0.25;
// Camera (Scene.tsx cam.*, App.tsx <Canvas>)
const FOV = 39;
const MAX_DPR = 2; // sen uses 1.5; on a 3x phone that halves the figure's resolution and stair-steps its outline
const CAM_DAMPING = 0.1;
const CAM_DWELL = 0.35;
const PARALLAX_DEG = 4;
const PARALLAX_EASE = 0.1;
const MOBILE_PULLBACK = 1.2;
const MOBILE_SHIFT = -0.12; // Scene.tsx mobileTimelineShift, as a share of the view
const EXPOSURE = 1.15; // a dark figure on the dark ground needs a little more light than sen's pale green
const NODE_LINE = 0.3; // a row is "reached" when its top is 30% down the screen
const FRAMES_PER_NODE = 50; // focusPoints.ts; only used to time the depth-of-field blend
const START_VIEW = 0.62; // the opening shows this share of the figure's height
const START_VIEW_PHONE = 0.46; // closer on a phone: the face, as sen frames it, not the waist
// Stops (scratch/home-3d.html)
const STOP_VIEW = 0.4; // a stop shows this share of the figure's height
const STOP_SHIFT = 0.32; // the stop sits left of centre, clear of the text on the right
// Post (Scene.tsx post.*)
const DOF_START_BOKEH = 7.4;
const DOF_START_RANGE = 2;
const DOF_STOP_BOKEH = 11;
const DOF_STOP_RANGE = 0.15;
const DOF_HEIGHT = 720; // sen's 480 px blur buffer stair-steps the outline at today's screen sizes
const BLOOM_INTENSITY = 0.6;
const BLOOM_THRESHOLD = 0.82;
// Lights (Scene.tsx Lights; RoomEnvironment stands in for env.hdr, whose licence is unclear)
const ENV_INTENSITY = 0.85;
const HEMI_INTENSITY = 1.15;
const KEY_INTENSITY = 2.35;
const FILL_INTENSITY = 2.25;
// Not in sen: a warm light from behind that draws the outline, which sen's pale backdrop does for him.
const RIM_INTENSITY = 2.4;
// The scene draws only while something can still be moving (~2 s at 60 fps after the last input).
const WAKE_FRAMES = 120;

type Pose = { pos: THREE.Vector3; quat: THREE.Quaternion; focus: THREE.Vector3 };
type Eye = { obj: THREE.Object3D; base: THREE.Quaternion; sx: number };

function lookPose(pos: THREE.Vector3, look: THREE.Vector3, focus: THREE.Vector3): Pose {
  const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pos, look, new THREE.Vector3(0, 1, 0)));
  return { pos, quat, focus };
}

export function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, stencil: false, depth: true });
    } catch {
      return; // No WebGL: the page is complete without the figure.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = EXPOSURE;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(GROUND);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = ENV_INTENSITY;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const isPhone = () => window.innerWidth <= 640 || coarse.matches;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 500);
    const composer = new EffectComposer(renderer, { multisampling: 0, stencilBuffer: false, depthBuffer: true });
    composer.addPass(new RenderPass(scene, camera));
    // Depth of field only where there is room for it: on a phone it costs the most and blurs the most.
    const dof = new DepthOfFieldEffect(camera, { worldFocusRange: DOF_STOP_RANGE, bokehScale: DOF_START_BOKEH, height: DOF_HEIGHT });
    dof.target = new THREE.Vector3();
    const dofPass = new EffectPass(camera, dof);
    composer.addPass(dofPass);
    composer.addPass(new EffectPass(camera, new BloomEffect({ mipmapBlur: true, intensity: BLOOM_INTENSITY, luminanceThreshold: BLOOM_THRESHOLD, luminanceSmoothing: 0.3 })));
    composer.addPass(new EffectPass(camera, new SMAAEffect()));

    const key = new THREE.DirectionalLight('#ffd9c6', KEY_INTENSITY);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const fill = new THREE.DirectionalLight('#9fc6ff', FILL_INTENSITY);
    fill.position.set(-5, 4, -4);
    const rim = new THREE.DirectionalLight('#ffd9b3', RIM_INTENSITY); // --color-accent
    rim.position.set(4, 3, -6);
    scene.add(new THREE.HemisphereLight('#ffffff', '#404040', HEMI_INTENSITY), key, fill, rim);


    let model: THREE.Object3D | null = null;
    let eyes: Eye[] = [];
    let anchors: (THREE.Object3D | null)[] = [];
    let poses: Pose[] = [];
    const focusStart = new THREE.Vector3();

    // One pose at the start (head and shoulders, the About over the chest), one per stop.
    function buildPoses() {
      if (!model) return;
      const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const aspect = window.innerWidth / window.innerHeight;
      const pull = isPhone() ? MOBILE_PULLBACK : 1;
      const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
      const frameH = isPhone() ? size.y * START_VIEW_PHONE : Math.max(size.y * START_VIEW, (size.x * 0.75) / aspect);
      const look0 = focusStart.clone().add(new THREE.Vector3(0, -frameH * 0.2, 0));
      const d0 = frameH / 2 / tan;
      const start = lookPose(look0.clone().add(new THREE.Vector3(0, frameH * 0.05, d0)), look0, focusStart.clone());
      const stops = anchors.map((a) => {
        if (!a) return start;
        const c = a.getWorldPosition(new THREE.Vector3());
        const n = new THREE.Vector3(0, 0, 1).applyQuaternion(a.getWorldQuaternion(new THREE.Quaternion())).normalize();
        const d = ((size.y * STOP_VIEW) / 2 / tan) * pull;
        const pos = c.clone().addScaledVector(n, d).add(new THREE.Vector3(0, d * 0.08, 0));
        const right = c.clone().sub(pos).normalize().cross(new THREE.Vector3(0, 1, 0)).normalize();
        const shift = isPhone() ? MOBILE_SHIFT : STOP_SHIFT;
        return lookPose(pos, c.clone().addScaledVector(right, d * tan * aspect * shift), c);
      });
      poses = [start, ...stops];
    }

    // Scroll → a continuous index s: -1 at the top, k at row k (Scene.tsx step 1, with its dwell).
    function scrollIndex(rows: HTMLElement[]): number {
      const m = rows.length;
      if (!m) return -1;
      const dwell = (t: number) => (t < CAM_DWELL ? 0 : t > 1 - CAM_DWELL ? 1 : THREE.MathUtils.smoothstep((t - CAM_DWELL) / (1 - 2 * CAM_DWELL), 0, 1));
      const line = window.scrollY + window.innerHeight * NODE_LINE;
      const tops = rows.map((el) => el.getBoundingClientRect().top + window.scrollY);
      if (line <= tops[0]) return -1 + dwell(THREE.MathUtils.clamp(window.scrollY / Math.max(1, tops[0] - window.innerHeight * NODE_LINE), 0, 1));
      for (let i = 0; i < m - 1; i++) if (line <= tops[i + 1]) return i + dwell((line - tops[i]) / Math.max(1, tops[i + 1] - tops[i]));
      return m - 1;
    }

    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-point]'));
    let disposed = false;
    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;
        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        const found: THREE.Object3D[] = [];
        model.traverse((o) => {
          if (/^eye/i.test(o.name)) found.push(o);
        });
        const mid = found.reduce((s, o) => s + o.position.x, 0) / Math.max(1, found.length);
        eyes = found.map((obj) => ({ obj, base: obj.quaternion.clone(), sx: found.length > 1 ? (obj.position.x < mid ? -1 : 1) : 0 }));
        anchors = rows.map((row) => model!.getObjectByName(row.dataset.point ?? '') ?? null);
        scene.add(model);
        model.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(model);
        if (eyes.length) {
          focusStart.set(0, 0, 0);
          eyes.forEach((e) => focusStart.add(e.obj.getWorldPosition(new THREE.Vector3())));
          focusStart.divideScalar(eyes.length);
        } else {
          const size = box.getSize(new THREE.Vector3());
          focusStart.set((box.min.x + box.max.x) / 2, box.max.y - size.y * 0.12, box.max.z - size.z * 0.3);
        }
        buildPoses();
        wake = WAKE_FRAMES;
        canvas.classList.add('is-ready');
      },
      undefined,
      () => {
        /* No model: the page stands without it. */
      },
    );

    // Pointer, in the canvas's own units (it fills the window).
    const mouse = { x: 0, y: 0 };
    const smouse = { x: 0, y: 0 };
    let wake = WAKE_FRAMES;
    const poke = () => {
      wake = WAKE_FRAMES;
    };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      poke();
    };
    const onResize = () => {
      dofPass.enabled = !isPhone();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      composer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      buildPoses();
      poke();
    };
    onResize();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', poke, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', poke);

    const clock = new THREE.Clock();
    const camPos = new THREE.Vector3();
    const camQuat = new THREE.Quaternion();
    const focus = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const quat = new THREE.Quaternion();
    const desired = new THREE.Quaternion();
    let s = -1;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      if (!model || !poses.length || document.hidden || wake <= 0) return;
      wake--;
      const still = reduced.matches;
      const touch = isPhone();

      // Camera: scroll picks the stop, damped; reduced motion stays at the start.
      s += ((still ? -1 : scrollIndex(rows)) - s) * (1 - Math.pow(CAM_DAMPING, dt));
      const x = THREE.MathUtils.clamp(s + 1, 0, poses.length - 1);
      const i = Math.min(Math.floor(x), poses.length - 2);
      const f = poses.length > 1 ? x - Math.max(i, 0) : 0;
      const A = poses[Math.max(i, 0)];
      const B = poses[Math.min(Math.max(i, 0) + 1, poses.length - 1)];
      camPos.lerpVectors(A.pos, B.pos, f);
      camQuat.slerpQuaternions(A.quat, B.quat, f);
      focus.lerpVectors(A.focus, B.focus, f);

      // Orbit the focus a few degrees toward the pointer (Scene.tsx 2b); not on touch or reduced motion.
      const follow = touch || still ? 0 : 1;
      const ease = touch || still ? 1 : 1 - Math.pow(PARALLAX_EASE, dt);
      smouse.x += (mouse.x * follow - smouse.x) * ease;
      smouse.y += (mouse.y * follow - smouse.y) * ease;
      const ax = THREE.MathUtils.degToRad(PARALLAX_DEG);
      quat.setFromEuler(euler.set(-smouse.y * ax, -smouse.x * ax, 0));
      camera.position.copy(tmp.copy(camPos).sub(focus).applyQuaternion(quat).add(focus));
      camera.quaternion.multiplyQuaternions(quat, camQuat);

      // Depth of field: the start's soft look at the top, tight focus at the stops (Post2's blend).
      const w = 1 - THREE.MathUtils.smoothstep((s + 1) * FRAMES_PER_NODE, 0, 48);
      dof.target!.copy(focus);
      dof.bokehScale = THREE.MathUtils.lerp(DOF_STOP_BOKEH, DOF_START_BOKEH, w);
      dof.cocMaterial.focusRange = THREE.MathUtils.lerp(DOF_STOP_RANGE, DOF_START_RANGE, w);

      // Eyes (Scene.tsx step 4); on touch they rest, looking ahead.
      if (eyes.length && !touch) {
        let ex = 0;
        let ey = 0;
        for (const e of eyes) {
          e.obj.getWorldPosition(tmp).project(camera);
          ex += tmp.x;
          ey += tmp.y;
        }
        const mx = mouse.x - ex / eyes.length;
        const my = mouse.y - ey / eyes.length;
        const yaw = mx * THREE.MathUtils.degToRad(EYE_MAX_YAW) * EYE_GAIN;
        const pitch = -my * THREE.MathUtils.degToRad(EYE_MAX_PITCH) * EYE_GAIN;
        const cross = THREE.MathUtils.degToRad(EYE_CROSS) * THREE.MathUtils.clamp(1 - Math.hypot(mx, my) / EYE_CROSS_RADIUS, 0, 1);
        for (const e of eyes) {
          desired.copy(quat.setFromEuler(euler.set(pitch, yaw - e.sx * cross, 0))).multiply(e.base);
          e.obj.quaternion.slerp(desired, EYE_SMOOTH);
        }
      } else {
        for (const e of eyes) e.obj.quaternion.slerp(e.base, 0.2);
      }

      composer.render(dt);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', poke);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', poke);
      composer.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="scene-canvas" aria-hidden />;
}
