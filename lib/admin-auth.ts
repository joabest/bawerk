import { createHmac, scryptSync, timingSafeEqual } from "node:crypto"

const COOKIE = "bawerk_admin"
const SESSION_SECONDS = 12 * 60 * 60

function adminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET
  return secret && secret.length >= 32 ? secret : null
}
export function adminConfigured(): boolean {
  const password = process.env.ADMIN_PASSWORD
  const hash = process.env.ADMIN_PASSWORD_HASH
  return !!adminSecret() && (!!(hash && /^[a-f\d]{32,128}:[a-f\d]{128}$/i.test(hash)) || !!(password && password.length >= 12))
}
function equal(a: string, b: string): boolean {
  const first = Buffer.from(a)
  const second = Buffer.from(b)
  return first.length === second.length && timingSafeEqual(first, second)
}
export function validPassword(value: string): boolean {
  if (!adminConfigured() || !value) return false
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (hash) {
    const [salt, expected] = hash.split(":")
    if (!salt || !expected || !/^[a-f\d]+$/i.test(salt + expected)) return false
    return equal(scryptSync(value, Buffer.from(salt, "hex"), 64).toString("hex"), expected.toLowerCase())
  }
  return equal(value, process.env.ADMIN_PASSWORD || "")
}
function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update("bawerk-admin-v2:" + payload).digest("hex")
}
export function token(): string {
  const secret = adminSecret()
  if (!secret || !adminConfigured()) throw new Error("ADMIN_SECRET e senha administrativa precisam ser configurados")
  const expiry = (Math.floor(Date.now() / 1000) + SESSION_SECONDS).toString()
  return "v2." + expiry + "." + sign(expiry, secret)
}
export function validToken(value?: string): boolean {
  const secret = adminSecret()
  if (!secret || !adminConfigured() || !value) return false
  const match = /^v2\.(\d{10})\.([a-f0-9]{64})$/.exec(value)
  if (!match) return false
  const expiry = Number(match[1])
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isSafeInteger(expiry) || expiry < now || expiry > now + SESSION_SECONDS) return false
  return equal(match[2], sign(match[1], secret))
}
export { COOKIE, SESSION_SECONDS }
