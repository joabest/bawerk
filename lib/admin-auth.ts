import "server-only"
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto"

const COOKIE = "bawerk_admin"
const SESSION_SECONDS = 12 * 60 * 60
const HASH_FORMAT = /^[a-f0-9]{32,128}:[a-f0-9]{128}$/i

function adminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET
  return secret && secret.length >= 32 ? secret : null
}

export function adminConfigured(): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH
  const legacy = process.env.ADMIN_PASSWORD
  // The hash takes priority. Keep ADMIN_PASSWORD only during the transition.
  return !!adminSecret() && (!!(hash && HASH_FORMAT.test(hash)) || !!(legacy && legacy.length >= 10))
}

function equalBuffers(a: Buffer, b: Buffer): boolean {
  // Compare equally sized buffers using the timing-safe primitive.
  return a.length === b.length && timingSafeEqual(a, b)
}

export function validPassword(value: string): boolean {
  if (!adminConfigured() || !value || value.length > 1024) return false
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (hash) {
    // Never fall back to the legacy password if a malformed hash is configured.
    if (!HASH_FORMAT.test(hash)) return false
    const [saltHex, expectedHex] = hash.split(":")
    const computed = scryptSync(value, Buffer.from(saltHex, "hex"), 64)
    return equalBuffers(computed, Buffer.from(expectedHex, "hex"))
  }
  const legacy = process.env.ADMIN_PASSWORD
  return !!legacy && equalBuffers(Buffer.from(value, "utf8"), Buffer.from(legacy, "utf8"))
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update("bawerk-admin-v2:" + payload).digest()
}
export function token(): string {
  const secret = adminSecret()
  if (!secret || !adminConfigured()) throw new Error("Admin não configurado")
  const expiry = (Math.floor(Date.now() / 1000) + SESSION_SECONDS).toString()
  return "v2." + expiry + "." + sign(expiry, secret).toString("hex")
}
export function validToken(value?: string): boolean {
  const secret = adminSecret()
  if (!secret || !adminConfigured() || !value) return false
  const match = /^v2\.(\d{10})\.([a-f0-9]{64})$/.exec(value)
  if (!match) return false
  const expiry = Number(match[1])
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isSafeInteger(expiry) || expiry < now || expiry > now + SESSION_SECONDS) return false
  return equalBuffers(Buffer.from(match[2], "hex"), sign(match[1], secret))
}
export { COOKIE, SESSION_SECONDS }
