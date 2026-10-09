import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { posts } from '@/content/writing';
import { profile } from '@/content/profile';

export const dynamic = 'force-static';

/** Every route the site has. Adding a project adds its page here too. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    '',
    '/work',
    '/writing',
    '/about',
    '/contact',
    ...projects.map((p) => `/work/${p.slug}`),
    ...posts.map((p) => `/writing/${p.slug}`),
  ];
  return paths.map((path) => ({
    url: `${profile.siteUrl}${path}/`.replace(/\/\/$/, '/'),
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
