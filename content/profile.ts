export const profile = {
  name: 'Samuel',
  handle: 'Samuelsenhet',
  location: 'Sweden',
  siteName: 'Samuel',
  /** Used in <title> and metadata. Kept short on purpose. */
  role: 'Software builder',
  /** The one sentence the whole site rests on. */
  statement:
    'I build software products end to end, mostly alone, and I run a circle where men talk. One of the products is in the App Store.',
  /** Published on the contact page. Set to null to take it off again. */
  email: 'samueel.pierre@hotmail.com' as string | null,
  github: 'https://github.com/Samuelsenhet',
  /** Set to null to take the row off the contact page again. */
  linkedin: 'https://www.linkedin.com/in/samuel-pierre-4a61bb333' as string | null,
  /**
   * The origin this site is served from. This is a GitHub Pages user page, so
   * it is served from the root of the domain and needs no basePath. Change it
   * here if a custom domain ever replaces it; canonical links and the Open
   * Graph image both resolve against this.
   */
  siteUrl: 'https://samuelsenhet.github.io',
} as const;
