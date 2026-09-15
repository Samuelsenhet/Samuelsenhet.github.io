import type { Metadata } from 'next';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Reach Samuel by email or on GitHub.`,
};

/** Only channels that actually exist get a row. */
const ways = [
  ...(profile.email
    ? [{ label: 'Email', value: profile.email, href: `mailto:${profile.email}` }]
    : []),
  { label: 'GitHub', value: `github.com/${profile.handle}`, href: profile.github },
  ...(profile.linkedin
    ? [
        {
          label: 'LinkedIn',
          value: profile.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
          href: profile.linkedin,
        },
      ]
    : []),
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <article className="max-w-[62ch] pt-20">
        <h1 className="text-title font-medium">Contact</h1>
        <p className="mt-4 text-mid">
          Write to me about building something, about the work here, or about collaborating. Opening
          an issue or a discussion on GitHub reaches me just as well as a message does.
        </p>

        <dl className="mt-10 border-t border-line">
          {ways.map((w) => (
            <div
              key={w.label}
              className="grid grid-cols-1 gap-x-6 border-b border-line py-4 sm:grid-cols-[7rem_1fr]"
            >
              <dt className="text-sm text-dim">{w.label}</dt>
              <dd>
                <a
                  href={w.href}
                  className="underline underline-offset-4 decoration-line hover:decoration-current"
                  {...(w.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {w.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  );
}
