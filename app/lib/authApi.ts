import { http } from "./http";
import type { AuthResponse } from "../types";

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type BackendUser = {
  id?: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
};

function normalizeRole(role?: string): "ADMIN" | "SELLER" | "USER" {
  const normalized = role?.toUpperCase();
  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "SELLER") return "SELLER";
  return "USER";
}

type BackendAuthData = {
  token?: string;
  access_token?: string;
  user?: BackendUser;
  id?: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
};

function toAuthResponse(data: BackendAuthData): AuthResponse {
  const user = data.user ?? data;
  const token = data.token ?? data.access_token;

  if (!token) {
    throw new Error("The server did not return an authentication token.");
  }

  if (!user.email) {
    throw new Error("The server response is missing the user's email.");
  }

  return {
    token,
    user: {
      id: String(user.id ?? user.email),
      name: user.full_name ?? user.name ?? user.email.split("@")[0],
      email: user.email,
      phone: user.phone ?? null,
      role: normalizeRole(user.role),
    },
  };
}

function userFromToken(token: string, fallbackEmail: string): AuthResponse {
  let claims: Record<string, unknown> = {};

  try {
    const encoded = token.split(".")[1];
    if (encoded) {
      const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
      claims = JSON.parse(atob(base64)) as Record<string, unknown>;
    }
  } catch {
    // Use the fallback email if the token payload can't be decoded.
  }

  const subject = String(claims.sub ?? "");
  const email =
    typeof claims.email === "string"
      ? claims.email
      : subject.includes("@")
        ? subject
        : fallbackEmail;

  return {
    token,
    user: {
      id: String(claims.user_id ?? claims.id ?? subject ?? email),
      name: String(claims.full_name ?? claims.name ?? email.split("@")[0]),
      email,
      phone: null,
      role: normalizeRole(typeof claims.role === "string" ? claims.role : undefined),
    },
  };
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await http.post<BackendAuthData>("/auth/register", {
    full_name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
  });

  const data = response.data;

  // If registration doesn't return a token, sign in with the new credentials.
  if (!data.token && !data.access_token) {
    return loginApi(payload.email, payload.password);
  }

  return toAuthResponse(data);
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await http.post<BackendAuthData>("/auth/login", {
    email,
    password,
  });

  const data = response.data;
  const token = data.token ?? data.access_token;

  if (!token) {
    throw new Error("The server did not return an authentication token.");
  }

  // If login returns only a token, try /auth/me; use token claims if that route is absent.
  if (!data.user && !data.email && !data.full_name && !data.name) {
    try {
      const meResponse = await http.get<BackendAuthData>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return toAuthResponse({ ...meResponse.data, token });
    } catch (error) {
      const status = (
        error as { response?: { status?: number } }
      ).response?.status;

      if (status === 404) {
        return userFromToken(token, email);
      }

      throw error;
    }
  }

  return toAuthResponse({ ...data, token });
}

export function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: {
        detail?: unknown;
      };
    };
    message?: string;
    code?: string;
  };

  if (err.code === "ERR_NETWORK") {
    return "Cannot reach the server. Is the backend running?";
  }

  const detail = err.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as {
      msg?: string;
      loc?: (string | number)[];
    };
    const field = first.loc?.[first.loc.length - 1];

    return field
      ? `${field}: ${first.msg ?? "Invalid value"}`
      : first.msg ?? "Invalid data";
  }

  return err.message ?? "Something went wrong. Please try again.";
}
