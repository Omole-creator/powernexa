import "server-only";
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";

const SESSION_COOKIE_NAME = "pnx_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a long random value in your environment before running in production."
    );
  }
  return "dev-only-insecure-secret-change-me-please";
}

// ---- Password hashing (scrypt, no external dependency) ----

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

// ---- Session cookie (HMAC-signed JSON, no JWT dependency) ----

export type SessionPayload = {
  userId: number;
  email: string;
  issuedAt: number;
};

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expectedSignature = sign(body);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    const ageSeconds = (Date.now() - payload.issuedAt) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
