import { createHmac, timingSafeEqual } from "node:crypto"

const COOKIE="bawerk_admin"
const PREVIEW_PASSWORD="1234"
const PREVIEW_SECRET="bawerk-admin-preview-session-v1"

function secret(){return process.env.ADMIN_SECRET||PREVIEW_SECRET}

export function validPassword(value:string){
  const expected=process.env.ADMIN_PASSWORD||PREVIEW_PASSWORD
  if(!value||!expected)return false
  const a=Buffer.from(value),b=Buffer.from(expected)
  return a.length===b.length&&timingSafeEqual(a,b)
}

export function token(){
  return createHmac("sha256",secret()).update("bawerk-admin-v1").digest("hex")
}

export function validToken(value?:string){
  if(!value)return false
  const a=Buffer.from(value),b=Buffer.from(token())
  return a.length===b.length&&timingSafeEqual(a,b)
}

export {COOKIE}
