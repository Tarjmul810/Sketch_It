const TOKEN_KEY = "token";

export interface AuthUser {
  userId: string;
  email: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const decoded = JSON.parse(atob(parts[1]!)) as { userId: string; email: string };
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
