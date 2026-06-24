import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  UI_BASE_URL: z.string().url().default('https://practicesoftwaretesting.com'),
  API_BASE_URL: z.string().url().default('https://api.practicesoftwaretesting.com'),
  ADMIN_EMAIL: z.string().email().default('admin@practicesoftwaretesting.com'),
  ADMIN_PASSWORD: z.string().min(1).default('welcome01'),
  CUSTOMER_EMAIL: z.string().email().default('customer@practicesoftwaretesting.com'),
  CUSTOMER_PASSWORD: z.string().min(1).default('welcome01'),
  TEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000)
});

export type Environment = z.infer<typeof environmentSchema>;

export function loadEnvironment(): Environment {
  return environmentSchema.parse(process.env);
}
