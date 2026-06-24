import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export default class EnterpriseReporter implements Reporter {
  private readonly results: Array<{ title: string; status: string; duration: number }> = [];
  private startTime = 0;

  onBegin(_config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    console.log(`Enterprise Playwright run started with ${suite.allTests().length} tests.`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.results.push({
      title: test.titlePath().join(' > '),
      status: result.status,
      duration: result.duration
    });
  }

  async onEnd(): Promise<void> {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter((result) => result.status === 'passed').length;
    const failed = this.results.filter((result) => result.status === 'failed').length;
    const skipped = this.results.filter((result) => result.status === 'skipped').length;

    const summary = [
      '# Enterprise Test Summary',
      '',
      `- Passed: ${passed}`,
      `- Failed: ${failed}`,
      `- Skipped: ${skipped}`,
      `- Total duration: ${duration}ms`,
      '',
      '## Results',
      ...this.results.map((result) => `- ${result.status.toUpperCase()} | ${result.duration}ms | ${result.title}`)
    ].join('\n');

    const outputPath = join('test-results', 'summary.md');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, summary, 'utf8');
    console.log(`Enterprise summary written to ${outputPath}`);
  }
}
