export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    throw new Error(`fetchJson failed: ${res.status} ${res.statusText} (${url})`);
  }
  return (await res.json()) as T;
}
