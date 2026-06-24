import type { TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function attachTracePlaceholder(testInfo: TestInfo, label: string): Promise<void> {
  const outputDir = join('test-results', 'traces');
  await mkdir(outputDir, { recursive: true });
  await testInfo.attach(label, {
    body: `Trace artifact placeholder for ${label}`,
    contentType: 'text/plain'
  });
}
