import { test, expect, request, type APIRequestContext } from '@playwright/test';
import { createDeterministicApiServer } from '../src/runtime/deterministic-api-server';
import { ApiClient } from '../src/runtime/api-client';
import { DeterministicDataFactory } from '../src/runtime/deterministic-data';
import { zUser } from '../src/generated';
import type { User, CreateUserRequest } from '../src/generated';

let api: APIRequestContext;
let client: ApiClient;
let baseUrl: string;
let server: ReturnType<typeof createDeterministicApiServer>;

 test.beforeAll(async () => {
  server = createDeterministicApiServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to determine test API port');

  baseUrl = `http://127.0.0.1:${address.port}`;
  api = await request.newContext();
  client = new ApiClient(api, baseUrl);
});

test.afterAll(async () => {
  await api.dispose();
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test.describe('contract-driven deterministic API tests', () => {
  test('@api GET user validates generated runtime schema', async () => {
    const response = await client.get<User>('/users/USR-0001');

    response.assertStatus(200).assertBody((body) => {
      const user = zUser.parse(body);
      expect(user).toEqual({
        id: 'USR-0001',
        name: 'Seed User 1',
        role: 'admin',
        active: true,
      });
    });
  });

  test('@api POST user uses generated model shape and deterministic data', async () => {
    const body: CreateUserRequest = DeterministicDataFactory.user(42, 'viewer');
    const response = await client.post<User, CreateUserRequest>('/users', body);

    response.assertStatus(201).assertBody((rawBody) => {
      const user = zUser.parse(rawBody);
      expect(user.id).toBe('USR-0042');
      expect(user.name).toBe('Automation User 42');
      expect(user.role).toBe('viewer');
      expect(user.active).toBe(true);
    });
  });
});
