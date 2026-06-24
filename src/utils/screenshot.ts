import type { Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function takeFrameworkScreenshot(page: Page, name: string): Promise<string> {
  const outputDir = join('test-results', 'screenshots');
  await mkdir(outputDir, { recursive: true });
  const filePath = join(outputDir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}
