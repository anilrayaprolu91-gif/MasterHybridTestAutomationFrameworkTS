import { mkdir } from 'node:fs/promises';

export default async function globalSetup(): Promise<void> {
  await mkdir('test-results', { recursive: true });
  await mkdir('playwright/.auth', { recursive: true });
}
