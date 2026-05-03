import { jwtDecode } from "jwt-decode";

const SESSION_STORAGE_KEY = "hy.google-session";

export type AuthUser = {
  email: string;
  name: string;
  picture?: string;
};

type GoogleJwtPayload = {
  email?: string;
  name?: string;
  picture?: string;
};

export function decodeGoogleCredential(credential: string): AuthUser | null {
  try {
    const payload = jwtDecode<GoogleJwtPayload>(credential);

    if (!payload.email || !payload.name) {
      return null;
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

export function loadStoredUser(): AuthUser | null {
  const rawValue = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function persistUser(user: AuthUser) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
