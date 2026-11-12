import "server-only"
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"
import { neon } from "@neondatabase/serverless"

const MAILBOX = "contato@bawerk.solutions"
const REGION: Record<string, { accounts: string; mail: string }> = {
  com: { accounts: "https://accounts.zoho.com", mail: "https://mail.zoho.com" },
  eu: { accounts: "https://accounts.zoho.eu", mail: "https://mail.zoho.eu" },
  in: { accounts: "https://accounts.zoho.in", mail: "https://mail.zoho.in" },
  "com.au": { accounts: "https://accounts.zoho.com.au", mail: "https://mail.zoho.com.au" },
  jp: { accounts: "https://accounts.zoho.jp", mail: "https://mail.zoho.jp" },
  ca: { accounts: "https://accounts.zohocloud.ca", mail: "https://mail.zohocloud.ca" },
  "com.cn": { accounts: "https://accounts.zoho.com.cn", mail: "https://mail.zoho.com.cn" },
  ae: { accounts: "https://accounts.zoho.ae", mail: "https://mail.zoho.ae" },
  sa: { accounts: "https://accounts.zoho.sa", mail: "https://mail.zoho.sa" },
}
function region() { return REGION[process.env.ZOHO_REGION || "com"] || REGION.com }
function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error("DATABASE_URL não configurada")
  return neon(url)
}
function key(): Buffer {
  const value = process.env.ZOHO_TOKEN_ENCRYPTION_KEY || ""
  if (!/^[a-f0-9]{64}$/i.test(value)) throw new Error("ZOHO_TOKEN_ENCRYPTION_KEY deve conter 64 caracteres hexadecimais")
  return Buffer.from(value, "hex")
}
export function zohoMissingConfig() {
  const missing = []
  if (!process.env.ZOHO_CLIENT_ID) missing.push("ZOHO_CLIENT_ID")
  if (!process.env.ZOHO_CLIENT_SECRET) missing.push("ZOHO_CLIENT_SECRET")
  if (!/^[a-f0-9]{64}$/i.test(process.env.ZOHO_TOKEN_ENCRYPTION_KEY || "")) missing.push("ZOHO_TOKEN_ENCRYPTION_KEY")
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) missing.push("DATABASE_URL")
  return missing
}
export function zohoRedirectUri() {
  return process.env.ZOHO_REDIRECT_URI || "https://bawerk.solutions/api/admin/zoho/callback"
}
export function authorizationUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: zohoRedirectUri(),
    scope: "ZohoMail.accounts.READ,ZohoMail.folders.READ,ZohoMail.messages.READ",
    access_type: "offline",
    prompt: "consent",
    state,
  })
  return region().accounts + "/oauth/v2/auth?" + params
}
async function exchange(params: URLSearchParams) {
  const response = await fetch(region().accounts + "/oauth/v2/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params, cache: "no-store", signal: AbortSignal.timeout(12000),
  })
  const result = await response.json() as Record<string, unknown>
  if (!response.ok || typeof result.access_token !== "string") throw new Error("Não foi possível obter o token OAuth da Zoho")
  return result
}
function credentials(params: Record<string, string>) {
  return new URLSearchParams({ client_id: process.env.ZOHO_CLIENT_ID || "", client_secret: process.env.ZOHO_CLIENT_SECRET || "", ...params })
}
export async function exchangeCode(code: string) {
  return exchange(credentials({ grant_type: "authorization_code", code, redirect_uri: zohoRedirectUri() }))
}
async function refreshToken(refresh: string) {
  return exchange(credentials({ grant_type: "refresh_token", refresh_token: refresh }))
}
function encrypt(secret: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key(), iv)
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()])
  return [iv, cipher.getAuthTag(), ciphertext].map(v => v.toString("base64url")).join(".")
}
function decrypt(value: string) {
  const [iv, tag, encrypted] = value.split(".")
  if (!iv || !tag || !encrypted) throw new Error("Token criptografado inválido")
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"))
  decipher.setAuthTag(Buffer.from(tag, "base64url"))
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8")
}
async function ensureConnectionTable() {
  const db = database()
  await db`CREATE TABLE IF NOT EXISTS bawerk_zoho_mail_connection (
    id TEXT PRIMARY KEY, account_id TEXT NOT NULL, encrypted_refresh_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
  return db
}
export async function readConnection() {
  const db = await ensureConnectionTable()
  const rows = await db`SELECT account_id, encrypted_refresh_token, updated_at FROM bawerk_zoho_mail_connection WHERE id='contact-mail' LIMIT 1`
  const item = rows[0]
  return item ? { accountId: String(item.account_id), encryptedToken: String(item.encrypted_refresh_token), updatedAt: String(item.updated_at) } : null
}
export async function saveConnection(accountId: string, refresh: string) {
  const db = await ensureConnectionTable()
  const protectedToken = encrypt(refresh)
  await db`INSERT INTO bawerk_zoho_mail_connection (id,account_id,encrypted_refresh_token)
    VALUES ('contact-mail',${accountId},${protectedToken})
    ON CONFLICT (id) DO UPDATE SET account_id=EXCLUDED.account_id,encrypted_refresh_token=EXCLUDED.encrypted_refresh_token,updated_at=NOW()`
}
export async function zohoFetch(path: string, accessToken: string) {
  if (!path.startsWith("/api/") || path.includes("..")) throw new Error("Caminho Zoho inválido")
  const response = await fetch(region().mail + path, {
    headers: { Authorization: "Zoho-oauthtoken " + accessToken, Accept: "application/json" },
    cache: "no-store", signal: AbortSignal.timeout(15000),
  })
  const result = await response.json() as { data?: unknown; status?: { code?: number }; error?: string }
  if (!response.ok || (result.status?.code && result.status.code >= 400)) throw new Error("A Zoho recusou a consulta (" + response.status + ")")
  return result
}
export async function authenticatedConnection() {
  const connected = await readConnection()
  if (!connected) throw new Error("Caixa Zoho ainda não conectada")
  const access = await refreshToken(decrypt(connected.encryptedToken))
  return { accountId: connected.accountId, accessToken: String(access.access_token) }
}
function mailboxMatches(account: Record<string, unknown>) {
  const addresses = [account.primaryEmailAddress, account.emailAddress, account.mailboxAddress, account.email, account.primaryEmailId]
  if (Array.isArray(account.aliases)) addresses.push(...account.aliases)
  if (Array.isArray(account.aliasEmailIds)) addresses.push(...account.aliasEmailIds)
  return addresses.some(value => typeof value === "string" && value.toLowerCase() === MAILBOX)
}
export async function findMailboxAccount(accessToken: string) {
  const result = await zohoFetch("/api/accounts", accessToken)
  const accounts = Array.isArray(result.data) ? result.data : []
  const account = accounts.find(value => value && typeof value === "object" && mailboxMatches(value as Record<string, unknown>)) as Record<string, unknown> | undefined
  const id = account?.accountId
  if (typeof id !== "string" && typeof id !== "number") throw new Error("A conta autorizada não contém contato@bawerk.solutions; confira o usuário e alias na Zoho")
  return String(id)
}
export async function listMailboxFolders(accountId: string, accessToken: string) {
  const result = await zohoFetch("/api/accounts/" + encodeURIComponent(accountId) + "/folders", accessToken)
  return (Array.isArray(result.data) ? result.data : []) as Record<string, unknown>[]
}
export function inboxFolderId(folders: Record<string, unknown>[]) {
  const inbox = folders.find(folder => {
    const name = String(folder.folderName || folder.folderType || folder.type || "").toLowerCase()
    return name === "inbox" || name === "caixa de entrada" || name === "entrada"
  })
  return String(inbox?.folderId || "")
}
export const MAILBOX_ADDRESS = MAILBOX
