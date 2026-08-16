import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

const seedUsers = new Map([
  ['USR-0001', { id: 'USR-0001', name: 'Seed User 1', role: 'admin', active: true }],
  ['USR-0002', { id: 'USR-0002', name: 'Seed User 2', role: 'user', active: true }],
]);

function send(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

export function createDeterministicApiServer() {
  const users = new Map(seedUsers);

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');

    if (request.method === 'GET' && /^\/users\/USR-\d{4}$/.test(url.pathname)) {
      const user = users.get(url.pathname.split('/')[2] ?? '');
      return user
        ? send(response, 200, user)
        : send(response, 404, { code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    if (request.method === 'POST' && url.pathname === '/users') {
      const body = await readJson(request);
      const name = String(body.name);
      const match = name.match(/(\d+)$/);
      const index = match?.[1] ?? '99';
      const id = `USR-${index.padStart(4, '0')}`;
      const user = { id, name, role: String(body.role), active: true };
      users.set(id, user);
      return send(response, 201, user);
    }

    return send(response, 404, { code: 'ROUTE_NOT_FOUND', message: 'Route not found' });
  });
}
