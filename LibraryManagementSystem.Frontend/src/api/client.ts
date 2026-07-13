import type { LoginResponse, ResponseDto } from '../types/api';

export const API_URL = 'http://localhost:5238/api';

type AuthUpdate = (auth: LoginResponse | null) => void;

let onAuthUpdate: AuthUpdate | null = null;

export function setAuthUpdateHandler(handler: AuthUpdate) {
  onAuthUpdate = handler;
}

function getStoredAuth(): LoginResponse | null {
  const raw = localStorage.getItem('auth');
  return raw ? (JSON.parse(raw) as LoginResponse) : null;
}

function storeAuth(auth: LoginResponse | null) {
  if (auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
  } else {
    localStorage.removeItem('auth');
  }
  onAuthUpdate?.(auth);
}

async function refreshTokens(): Promise<LoginResponse | null> {
  const auth = getStoredAuth();
  if (!auth?.refreshToken || !auth.accessToken) return null;

  const response = await fetch(`${API_URL}/auth/refreshtoken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    }),
  });

  const result = (await response.json()) as ResponseDto<LoginResponse>;
  if (!result.success || !result.data) return null;

  storeAuth(result.data);
  return result.data;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<ResponseDto<T>> {
  const auth = getStoredAuth();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth?.accessToken) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const result = (await response.json()) as ResponseDto<T>;

  if (response.status === 401 && retry && auth?.refreshToken) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return apiRequest<T>(path, options, false);
    }
    storeAuth(null);
  }

  return result;
}

export function saveAuth(auth: LoginResponse) {
  storeAuth(auth);
}

export function clearAuth() {
  storeAuth(null);
}

export function loadAuth(): LoginResponse | null {
  return getStoredAuth();
}
