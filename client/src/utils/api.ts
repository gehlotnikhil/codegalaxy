// src/utils/api.ts
const BASE_URL = import.meta.env.VITE_SERVER_URL

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
 

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}
