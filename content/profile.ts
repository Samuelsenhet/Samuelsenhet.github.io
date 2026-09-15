export const profile = {
  name: 'Samuel',
  handle: 'Samuelsenhet',
  location: 'Sweden',
  siteName: 'Samuel',
  /** Used in <title> and metadata. Kept short on purpose. */
  role: 'Software builder',
  /** The one sentence the whole site rests on. */
  statement:
    'I build software products end to end, mostly alone. One of them is in the App Store.',
  /**
   * Set this to publish an email address on the contact page. It stays off
   * until you choose it: a public address on a public page gets scraped, and
   * that is your call to make, not a default.
   */
  email: null as string | null,
  github: 'https://github.com/Samuelsenhet',
  /** Replace with the real deployed origin once hosting is chosen. */
  siteUrl: 'https://samuelsenhet.github.io',
} as const;
