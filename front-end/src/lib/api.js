// lib/api.js
const BASE_URL ="http://localhost:5050";

export async function api(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { token }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}/api/v1${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}
