import type { Metadata } from 'next';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'About',
  description: 'Samuel builds software products end to end, from Sweden.',
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <article className="max-w-[62ch] pt-20">
        <h1 className="text-title font-medium">About</h1>

        <div className="mt-8 space-y-5">
          <p>
            I am Samuel. I build software products in {profile.location}, usually on my own, and I
            take them the whole way rather than stopping at a prototype.
          </p>
          <p>
            In practice that means doing every job. I design the interface, write the app, model the
            database and its access rules, run the migrations, ship the builds, write the store
            listing in two languages, and answer for it at review. It is slower than specialising,
            but it means nothing about a product is a mystery to me.
          </p>
          <p>
            The work tends toward the same question: what does software owe the person using it. An
            app that puts self-knowledge ahead of a feed, and shows you in plain language everything
            it knows about you. A voice that refuses to paraphrase scripture, because being
            confidently wrong about it would be worse than saying nothing. A marketplace that stops
            making buyers do the searching.
          </p>
          <p>
            My tools are mostly TypeScript, React and React Native, Expo, and Postgres by way of
            Supabase. I care much more about what a product does to someone than about which
            framework it was built with.
          </p>
          <p className="text-mid">
            Most of what I build is closed source today. That is a decision about timing, not a
            position on open source, and this website is public precisely because it should be.
          </p>
        </div>
      </article>
    </div>
  );
}
