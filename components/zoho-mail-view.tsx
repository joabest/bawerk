"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, ExternalLink, Inbox, LockKeyhole, Mail, RefreshCcw, Search, ShieldCheck, X } from "lucide-react"

type Message = {
  messageId?: string | number
  subject?: string
  fromAddress?: string
  sender?: string
  summary?: string
  receivedTime?: string | number
  folderId?: string
  status?: string
  status2?: string
  hasAttachment?: string | boolean
}
type Status = { connected?: boolean; configured?: boolean; address?: string; missing?: string[]; updatedAt?: string | null; error?: string }
type Selected = { message: Message; content: string; detail?: Record<string, unknown> }
function dateLabel(value?: string | number) {
  if (!value) return ""
  const raw = Number(value)
  const date = Number.isFinite(raw) && raw > 100000000 ? new Date(raw < 1e12 ? raw * 1000 : raw) : new Date(String(value))
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}
function messageId(message: Message) { return String(message.messageId || "") }

export function ZohoMailView() {
  const [status, setStatus] = useState<Status | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [start, setStart] = useState(1)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<Selected | null>(null)
  const statusNotice = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("zoho") : null
  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/zoho/status", { cache: "no-store" })
      if (!response.ok) throw new Error("Sua sessão administrativa expirou.")
      setStatus(await response.json() as Status)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Erro ao consultar integração") }
  }, [])
  const loadMessages = useCallback(async (offset: number) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/zoho/messages?start=" + offset, { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erro ao consultar caixa de entrada")
      setMessages(Array.isArray(data.messages) ? data.messages : [])
      setStart(offset)
      setSelected(null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Erro ao consultar mensagens") }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void loadStatus() }, [loadStatus])
  useEffect(() => { if (status?.connected) void loadMessages(1) }, [status?.connected, loadMessages])
  const visible = useMemo(() => messages.filter(message => [message.subject, message.fromAddress, message.sender, message.summary].join(" ").toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [messages, query])
  async function openMessage(message: Message) {
    const id = messageId(message)
    if (!/^\d+$/.test(id)) { setError("Identificador da mensagem inválido"); return }
    setOpening(true)
    setError("")
    try {
      const response = await fetch("/api/admin/zoho/messages/" + encodeURIComponent(id), { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Não foi possível abrir a mensagem")
      setSelected({ message, content: typeof data.content === "string" ? data.content : "", detail: data.detail && typeof data.detail === "object" ? data.detail : undefined })
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Falha ao abrir e-mail") }
    finally { setOpening(false) }
  }
  return <div className="space-y-6 text-white">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="font-mono text-[11px] tracking-widest text-[#85b8ff]">ZOHO MAIL / BAWERK</p><h1 className="mt-2 text-3xl font-semibold">Caixa de entrada</h1><p className="mt-2 text-sm text-zinc-400">contato@bawerk.solutions · leitura protegida pelo painel administrativo.</p></div>
      {status?.connected && <button onClick={() => void loadMessages(1)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm hover:border-[#4169E1] disabled:opacity-50"><RefreshCcw size={16} /> Atualizar</button>}
    </div>
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-blue-400/25 bg-blue-400/10 px-4 py-3 text-xs text-blue-200"><ShieldCheck size={17}/> OAuth oficial da Zoho</div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300"><LockKeyhole size={17}/> Acesso somente de leitura</div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300"><Mail size={17}/> Respostas em próxima etapa</div>
    </div>
    {statusNotice === "connected" && <p role="status" className="rounded-xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-300">Conta Zoho autorizada. Sua caixa de entrada já pode ser consultada.</p>}
    {statusNotice && statusNotice !== "connected" && <p role="alert" className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">A autorização não foi concluída ({statusNotice}). Verifique a conta e tente novamente.</p>}
    {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
    {!status && !error && <p className="text-sm text-zinc-400">Verificando a integração com a Zoho…</p>}
    {status && !status.connected && <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#10151e] p-6">
      <div className="mb-4 flex items-center gap-3"><Inbox size={25} className="text-[#78baff]"/><h2 className="text-xl font-semibold">Conectar contato@bawerk.solutions</h2></div>
      <p className="mb-5 text-sm leading-7 text-zinc-400">Para começar, registre um aplicativo do tipo <strong className="text-white">Server-based</strong> no console oficial da Zoho e configure as variáveis de ambiente na Vercel. Você autorizará a caixa diretamente na Zoho, sem informar a senha neste painel.</p>
      {status.missing?.length ? <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="mb-2 text-xs font-semibold text-amber-200">Variáveis ainda não configuradas na Vercel:</p>
        {status.missing.map(item => <code className="mb-1 block text-xs text-zinc-200" key={item}>{item}</code>)}
      </div> : null}
      {status.error && <p className="mb-4 text-sm text-red-300">{status.error}</p>}
      <div className="flex flex-wrap gap-3">
        <a className={"inline-flex items-center gap-2 rounded-xl bg-[#4169E1] px-5 py-3 text-sm font-medium hover:bg-[#547cf1] " + (status.missing?.length ? "pointer-events-none opacity-50" : "")} href="/api/admin/zoho/connect">Autorizar conta Zoho <ExternalLink size={15}/></a>
        <a className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm hover:bg-white/5" href="https://api-console.zoho.com/" target="_blank" rel="noopener noreferrer">Console Zoho <ExternalLink size={15}/></a>
      </div>
      <p className="mt-5 text-xs text-zinc-500">Redirect URI: https://bawerk.solutions/api/admin/zoho/callback</p>
    </div>}
    {status?.connected && <div className="rounded-2xl border border-white/10 bg-[#10141b] p-4 sm:p-5">
      {selected ? <div>
        <button onClick={() => setSelected(null)} className="mb-5 inline-flex items-center gap-2 text-sm text-[#99bfff] hover:text-white"><ArrowLeft size={16}/> Voltar à caixa de entrada</button>
        <div className="border-b border-white/10 pb-5"><p className="font-mono text-xs text-zinc-500">DE: {selected.message.fromAddress || selected.message.sender || "Remetente não informado"}</p><h2 className="mt-3 text-xl font-semibold">{selected.message.subject || "(sem assunto)"}</h2><p className="mt-2 text-xs text-zinc-500">{dateLabel(selected.message.receivedTime)}</p></div>
        <div className="min-h-[210px] whitespace-pre-wrap break-words py-7 text-sm leading-7 text-zinc-200">{selected.content || "A mensagem não possui conteúdo de texto para exibição."}</div>
        <div className="border-t border-white/10 pt-4"><button disabled className="rounded-lg border border-white/10 px-4 py-2 text-xs text-zinc-500">Responder (próxima etapa)</button></div>
      </div> : <>
        <div className="mb-4 flex flex-wrap items-center gap-3"><h2 className="mr-auto flex items-center gap-2 text-lg font-semibold"><Inbox size={19} className="text-[#82baff]"/> Recebidos</h2><label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2"><Search size={16} className="text-zinc-500"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nesta página" className="w-40 bg-transparent text-xs outline-none sm:w-60"/></label></div>
        {loading || opening ? <p className="p-7 text-sm text-zinc-400">Carregando mensagens da Zoho…</p> : <div className="divide-y divide-white/10">{visible.length ? visible.map((message, index) => <button type="button" key={messageId(message) || index} className="flex w-full items-center gap-4 px-2 py-4 text-left transition hover:bg-white/5" onClick={() => void openMessage(message)}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#182339]"><Mail size={17} className="text-[#77b6f1]"/></span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{message.sender || message.fromAddress || "Remetente"}</span><span className="mt-1 block truncate text-sm text-zinc-300">{message.subject || "(sem assunto)"}</span>{message.summary && <span className="mt-1 block truncate text-xs text-zinc-500">{message.summary}</span>}</span><span className="shrink-0 text-xs text-zinc-500">{dateLabel(message.receivedTime)}</span>
        </button>) : <p className="py-12 text-center text-sm text-zinc-400">{query ? "Nenhuma mensagem corresponde à pesquisa." : "Nenhuma mensagem nesta página."}</p>}</div>}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><button disabled={start <= 1 || loading} onClick={() => void loadMessages(Math.max(1, start - 25))} className="flex items-center gap-2 text-sm text-zinc-300 disabled:opacity-30"><ArrowLeft size={15}/> Anterior</button><span className="text-xs text-zinc-500">A partir da mensagem {start}</span><button disabled={messages.length < 25 || loading} onClick={() => void loadMessages(start + 25)} className="flex items-center gap-2 text-sm text-zinc-300 disabled:opacity-30">Próxima <ArrowRight size={15}/></button></div>
      </>}
    </div>}
  </div>
}
