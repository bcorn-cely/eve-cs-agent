const BASE = "https://billing-api.northwind.vercel.zone";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const TOKEN = process.env.NORTHWIND_BILLING_API_TOKEN;
  const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "";

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "x-vercel-protection-bypass": BYPASS_SECRET,
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}
