import type { Metadata, Viewport } from 'next';
import { Familjen_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { profile } from '@/content/profile';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import './globals.css';

const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-familjen',
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f4f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1620' },
  ],
};

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong one. Reads can throw in a locked-down browser, so it fails silently
 * and falls back to dark.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.classList.toggle('dark',(t||d)!=='light')}catch(e){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${familjen.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile.name,
              jobTitle: profile.role,
              url: profile.siteUrl,
              sameAs: [profile.github, profile.linkedin].filter(Boolean),
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
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
