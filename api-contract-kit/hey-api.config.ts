import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './api-contract-kit/openapi.yaml',
  output: './api-contract-kit/src/generated',
  plugins: [
    '@hey-api/sdk',
    'zod',
  ],
});
