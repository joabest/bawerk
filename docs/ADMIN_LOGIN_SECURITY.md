# Login administrativo — migração segura

Branch: `security/admin-login`. Nenhuma variável secreta deve ser versionada.

## Variáveis de ambiente (Vercel)

- `UPSTASH_REDIS_REST_URL` — URL HTTPS REST do Redis Upstash (nova; obrigatória).
- `UPSTASH_REDIS_REST_TOKEN` — token REST secreto do Redis Upstash (nova; obrigatório).
- `ADMIN_SECRET` — segredo HMAC existente, **não rotacionar durante a migração** para manter sessões ativas.
- `ADMIN_PASSWORD_HASH` — hash scrypt no formato `saltHex:derivedKeyHex` (nova; definir depois de gerar).
- `ADMIN_PASSWORD` — senha legada temporária; remover quando `ADMIN_PASSWORD_HASH` tiver sido validado.

Configure os segredos apenas na Vercel. Nunca use `NEXT_PUBLIC_` para valores secretos.

## Gerar hash scrypt offline

No computador de desenvolvimento, atribua `ADMIN_PASSWORD` no ambiente local
sem exibi-la nos logs. Execute:

```sh
node -e 'const { randomBytes,scryptSync } = require("node:crypto"); const password = process.env.ADMIN_PASSWORD; if (!password || password.length < 10) process.exit(1); const salt = randomBytes(32); process.stdout.write(salt.toString("hex")+":"+scryptSync(password,salt,64).toString("hex")+"\n")'
```

Copie apenas a saída `salt:hash` para `ADMIN_PASSWORD_HASH` na Vercel.
A aplicação **prioriza o hash** e só usa `ADMIN_PASSWORD` quando não há hash.
Após confirmar um login bem-sucedido, remova `ADMIN_PASSWORD`.
Manter `ADMIN_SECRET` preserva a validade de cookies administrativos emitidos anteriormente até expirarem (12 h).
Se `ADMIN_PASSWORD_HASH` estiver presente mas inválido, a validação falha sem fallback.

## Comportamento do rate limit

- `@upstash/ratelimit` com janela deslizante de **5 tentativas por 15 minutos**.
- Cada tentativa de login consome uma posição, inclusive sucessos.
- O identificador usa `x-vercel-forwarded-for` injetado pela Vercel;
  não consulta `x-forwarded-for` cru.
- Se o cabeçalho não trouxer um único IP válido em produção, usa-se um bucket compartilhado restritivo.
- Excesso de tentativas: HTTP 429, `Retry-After` em segundos.
- Redis ausente/indisponível: HTTP 503 e `Retry-After: 60` (fail closed).
- As APIs de escrita administrativas exigem sessão e um `Origin` permitido.
- Os GETs da integração OAuth Zoho continuam protegidos por sessão, cookie `state`
  aleatório, expiração e comparação segura no callback.

## Procedimento de ativação

1. Configure o Redis e as duas variáveis Upstash.
2. Gere `ADMIN_PASSWORD_HASH` offline e configure-o, mantendo a senha anterior temporariamente.
3. Valide login, limite de tentativas, permissões e callback Zoho em preview autorizado.
4. Remova `ADMIN_PASSWORD` após confirmação; não altere `ADMIN_SECRET` na migração.
5. Realize deploy em produção somente após revisão, testes e aprovação explícita.

**Aviso:** o `test` de origem pode ter dependências Next/React desatualizadas.
A atualização de dependências está isolada na branch `security/deps-and-gitignore`;
esta branch não inclui essas alterações.
