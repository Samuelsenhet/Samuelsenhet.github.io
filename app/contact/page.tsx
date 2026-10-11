import type { Metadata } from 'next';
import { profile } from '@/content/profile';
import { PageHead } from '@/components/PageHead';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Reach Samuel by email or on GitHub.`,
};

/** Only channels that actually exist get a row. */
const ways = [
  ...(profile.email ? [{ label: 'Email', value: profile.email, href: `mailto:${profile.email}` }] : []),
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
  ...(profile.instagram
    ? [
        {
          label: 'Instagram',
          value: profile.instagram.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
          href: profile.instagram,
        },
      ]
    : []),
];

/** Line icons for the round buttons, drawn here so the page loads no icon set. */
const icons: Record<string, React.ReactNode> = {
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.06c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5.07c0-1.21-.02-2.77-1.69-2.77-1.69 0-1.95 1.32-1.95 2.68V21h-4V9.75Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/** sen-3d-resume's round icon buttons (.tl-logo): one per channel that exists, named for screen readers. */
export default function Contact() {
  return (
    <article className="page">
      <PageHead kicker="Write to me" title="Contact">
        <p>
          Write to me about building something, about the work here, or about collaborating. Opening an issue or a
          discussion on GitHub reaches me just as well as a message does.
        </p>
      </PageHead>
      <ul className="icons rv">
        {ways.map((w) => (
          <li key={w.label}>
            <a
              href={w.href}
              className="icon"
              aria-label={`${w.label}: ${w.value}`}
              title={w.value}
              {...(w.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span aria-hidden>{icons[w.label]}</span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
