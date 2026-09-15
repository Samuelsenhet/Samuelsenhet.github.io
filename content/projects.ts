export type ProjectStatus = 'shipped' | 'building';

export type Project = {
  slug: string;
  name: string;
  /** One line, plain language, no selling. */
  summary: string;
  status: ProjectStatus;
  /** Shown in the ledger's value column. A version for shipped work, a dash otherwise. */
  marker: string;
  statusLabel: string;
  year: string;
  /** Set only when the source is public. Every repo is private today. */
  repo: string | null;
  /** Set only when there is something a stranger can actually open. */
  link: { label: string; href: string } | null;
  stack: string[];
  /** Paragraphs for the project page. */
  body: string[];
  /** Short, concrete, verifiable. Rendered as a definition list. */
  facts: { term: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: 'maak',
    name: 'MÄÄK',
    summary:
      'A Swedish dating app that matches on personality instead of photographs.',
    status: 'shipped',
    marker: '1.0.7',
    statusLabel: 'Live on the App Store',
    year: '2026',
    repo: null,
    link: {
      label: 'View on the App Store',
      href: 'https://apps.apple.com/se/app/id6789912827',
    },
    stack: ['TypeScript', 'Expo', 'React', 'Supabase', 'PostgreSQL'],
    body: [
      'Most dating apps ask you to judge a face in half a second. MÄÄK asks what you are actually like, and then does the matching work for you. Every day it proposes a small number of people: some who resemble you, some who complement you. There is no infinite grid to scroll.',
      'It signs people in with their phone number over SMS, keeps conversations in realtime, and includes a short video call called Kemi-Check, because chemistry is the one thing text cannot tell you.',
      'I built all of it: the iOS app, the web app, the database, the row level security policies, the edge functions, the Swedish and English copy, the App Store listing, and the review submissions. It is on version 1.0.7.',
    ],
    facts: [
      { term: 'Platform', value: 'iOS, built with Expo and EAS' },
      { term: 'Backend', value: 'Supabase: Postgres, Realtime, Edge Functions' },
      { term: 'Sign-in', value: 'Phone number, SMS one-time code' },
      { term: 'Languages', value: 'Swedish and English' },
      { term: 'Source', value: 'Private' },
    ],
  },
  {
    slug: 'bibelrosten',
    name: 'Bibelrösten',
    summary:
      'A Swedish voice you can call and talk with, which cannot misquote scripture.',
    status: 'building',
    marker: '0.1',
    statusLabel: 'In development',
    year: '2026',
    repo: null,
    link: null,
    stack: ['TypeScript', 'Anthropic API', 'WebSockets', 'Speech to text', 'Text to speech'],
    body: [
      'You call it the way you call a person. It listens, it talks back in Swedish, and after five minutes it says goodbye. There is no account, no chat log to read, and no library of content to browse. One screen: a name, a circle, and a button that says Ring.',
      'The hard part is not the conversation. It is the promise that when the voice says "the Bible says", the words that follow are really in the Bible. Language models paraphrase scripture confidently and incorrectly, so the model is not allowed to write it. The model writes a reference; a control layer between speech recognition and speech synthesis looks that reference up and inserts the verified text. The model never holds the quote.',
      'Memory lives on the phone, not on a server, and deleting it deletes it. The 0.1 build closed in September 2026.',
    ],
    facts: [
      { term: 'Shape', value: 'A five minute spoken call, no account' },
      { term: 'The rule', value: 'The model writes a reference, the server inserts the text' },
      { term: 'Memory', value: 'Stored on the device, genuinely deletable' },
      { term: 'Language', value: 'Swedish' },
      { term: 'Source', value: 'Private' },
    ],
  },
  {
    slug: 'crava',
    name: 'Crava',
    summary:
      'A second-hand marketplace turned around: buyers post what they want, sellers come to them.',
    status: 'building',
    marker: '',
    statusLabel: 'In development',
    year: '2026',
    repo: null,
    link: null,
    stack: ['TypeScript', 'React Native', 'Expo Router', 'Supabase'],
    body: [
      'On every second-hand site the buyer does the searching. You scan a thousand listings, none of them is the thing you wanted, and you give up. Crava reverses it. The buyer writes down the exact thing they are looking for, and sellers who own that thing send offers.',
      'That inversion only works if both sides trust a stranger enough to complete the trade, so identity is verified with BankID and the money is held in escrow until the item arrives.',
      'It is a Swedish marketplace, built mobile first. Still in development.',
    ],
    facts: [
      { term: 'Model', value: 'Buyers post wishes, sellers send offers' },
      { term: 'Trust', value: 'BankID identity check, escrowed payment' },
      { term: 'Platform', value: 'iOS and Android, built with Expo' },
      { term: 'Market', value: 'Sweden' },
      { term: 'Source', value: 'Private' },
    ],
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
