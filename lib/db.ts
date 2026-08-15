import { neon } from "@neondatabase/serverless"
export type Lead={id:number;name:string;email:string;phone:string|null;company:string|null;service:string|null;budget:string|null;message:string;status:string;created_at:string}
function sql(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!url) throw new Error("DATABASE_URL não configurada");return neon(url)}
export async function ensureTable(){await sql()`CREATE TABLE IF NOT EXISTS bawerk_leads (id SERIAL PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT,company TEXT,service TEXT,budget TEXT,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`}
export async function createLead(data:Omit<Lead,"id"|"status"|"created_at">){await ensureTable();const rows=await sql()`INSERT INTO bawerk_leads (name,email,phone,company,service,budget,message) VALUES (${data.name},${data.email},${data.phone},${data.company},${data.service},${data.budget},${data.message}) RETURNING id`;return rows[0]}
export async function listLeads(){await ensureTable();return await sql()`SELECT * FROM bawerk_leads ORDER BY created_at DESC` as Lead[]}
export async function markLead(id:number,status:string){await ensureTable();await sql()`UPDATE bawerk_leads SET status=${status} WHERE id=${id}`}
