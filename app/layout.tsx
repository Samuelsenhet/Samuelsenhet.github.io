import type { Metadata, Viewport } from 'next';
import { Cormorant_Upright, Familjen_Grotesk, IBM_Plex_Mono, Mansalva } from 'next/font/google';
import { profile } from '@/content/profile';
import { Nav } from '@/components/Nav';
import { Chrome } from '@/components/Chrome';
import { Reveal } from '@/components/Reveal';
import { Footer } from '@/components/Footer';
import './globals.css';

const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-familjen',
  display: 'swap',
});

/* sen-3d-resume's two display faces: Cormorant Upright for headings, Mansalva for the one hand-written title. */
const cormorant = Cormorant_Upright({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const mansalva = Mansalva({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mansalva',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name}, ${profile.role.toLowerCase()}`,
    template: `%s, ${profile.name}`,
  },
  description: profile.statement,
  openGraph: {
    type: 'website',
    siteName: profile.siteName,
    title: `${profile.name}, ${profile.role.toLowerCase()}`,
    description: profile.statement,
    locale: 'en',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${profile.name}, ${profile.role.toLowerCase()}` }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  /**
   * './' resolves against the route being rendered, so every page is its own
   * canonical. A literal '/' here is inherited by every child, which tells a
   * search engine the whole site is a duplicate of the home page.
   */
  alternates: { canonical: './' },
};

/* One theme: the site is dark only since the 3D home page (D-002). */
export const viewport: Viewport = {
  themeColor: '#0f1620',
};

/**
 * Arms the scroll entrance before first paint, so nothing visibly appears and
 * then hides. If the script that reveals things never runs, the class comes
 * off again after four seconds and the page stays readable.
 */
const revealScript = `(function(){if(!('IntersectionObserver' in window))return;var d=document.documentElement;d.classList.add('reveal');setTimeout(function(){if(!window.__reveal)d.classList.remove('reveal')},4000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${familjen.variable} ${plexMono.variable} ${cormorant.variable} ${mansalva.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile.name,
              jobTitle: profile.role,
              url: profile.siteUrl,
              sameAs: [profile.github, profile.linkedin, profile.instagram].filter(Boolean),
              address: { '@type': 'PostalAddress', addressCountry: 'SE' },
            }),
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-raised focus:text-text focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        <Chrome />
        <Nav />
        <main id="main" className="relative z-10 flex-1">
          {children}
        </main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
