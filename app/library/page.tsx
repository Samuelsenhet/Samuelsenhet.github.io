import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { bookLooks, buildShelves } from '@/content/library';
import { Library } from '@/components/library/Library';

export const metadata: Metadata = {
  title: 'Library',
  description:
    'What I have made, as books on two shelves: what is live, and what is still on the workbench.',
};

export default function LibraryPage() {
  return <Library shelves={buildShelves(projects, bookLooks)} />;
}
