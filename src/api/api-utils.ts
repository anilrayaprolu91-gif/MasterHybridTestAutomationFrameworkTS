export function bearerHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`
  };
}

export function toQueryString(parameters: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
