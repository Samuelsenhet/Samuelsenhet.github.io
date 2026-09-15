import next from 'eslint-config-next';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * eslint-config-next ships flat config directly, so no FlatCompat layer.
 *
 * TypeScript is pinned to 6 rather than 7 in package.json: typescript-eslint
 * does not support the TS 7 compiler yet, and a working lint is worth more
 * here than a newer compiler for a site that uses no TS 7 features.
 */
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
  ...nextTypescript,
];

export default config;
