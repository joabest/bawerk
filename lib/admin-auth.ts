import { createHmac, timingSafeEqual } from "node:crypto"
const COOKIE="bawerk_admin"
function secret(){return process.env.ADMIN_SECRET||""}
export function validPassword(value:string){const expected=process.env.ADMIN_PASSWORD||"";if(!value||!expected)return false;const a=Buffer.from(value),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
export function token(){return createHmac("sha256",secret()).update("bawerk-admin-v1").digest("hex")}
export function validToken(value?:string){if(!value||!secret())return false;const a=Buffer.from(value),b=Buffer.from(token());return a.length===b.length&&timingSafeEqual(a,b)}
export {COOKIE}
