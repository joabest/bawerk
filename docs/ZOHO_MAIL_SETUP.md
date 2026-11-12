# BA W E R K  /  Configuração do Admin e Zoho Mail

Este projeto possui uma rota privada `/admin` e um módulo de leitura da conta `contato@bawerk.solutions`.

## 1. Ativar autenticação segura

No projeto **joabests-projects/bawerk** na Vercel, em Settings → Environment Variables, configure:

- `ADMIN_SECRET`: valor aleatório com pelo menos 32 caracteres, exclusivo para esse ambiente.
- `ADMIN_PASSWORD_HASH`: salt e hash scrypt da senha de administração, ambos em hexadecimal, separados por `:`.
- `DATABASE_URL`: conexão existente do Neon (deve permanecer configurada).

Para gerar um segredo e o hash **localmente**, abra Node.js 18+ na sua máquina e rode:

```js
const { randomBytes, scryptSync } = require("node:crypto")
const password = process.env.NEW_ADMIN_PASSWORD
if (!password || password.length < 12) throw Error("Configure NEW_ADMIN_PASSWORD com pelo menos 12 caracteres")
const salt = randomBytes(16)
console.log("ADMIN_SECRET=" + randomBytes(32).toString("hex"))
console.log("ADMIN_PASSWORD_HASH=" + salt.toString("hex") + ":" + scryptSync(password, salt, 64).toString("hex"))
```

Não envie senha, hash, segredo ou credenciais no chat. Salve apenas na Vercel e mantenha os valores fora do GitHub. A antiga senha demonstrativa não é aceita.

O login utiliza cookie HttpOnly/SameSite e expira após 12 horas. Sair do painel invalida o cookie no navegador.

## 2. Registrar a integração no Zoho

1. Acesse https://api-console.zoho.com/ na região/data center da sua conta e crie um aplicativo OAuth do tipo **Server-based Applications**.
2. Cadastre exatamente esta URL de redirecionamento:
   `https://bawerk.solutions/api/admin/zoho/callback`
3. Salve o Client ID e Client Secret no projeto original da Vercel.
4. Configure as seguintes variáveis no mesmo projeto:
   - `ZOHO_CLIENT_ID`: Client ID do aplicativo
   - `ZOHO_CLIENT_SECRET`: segredo do aplicativo
   - `ZOHO_TOKEN_ENCRYPTION_KEY`: **64 caracteres hexadecimais** (32 bytes aleatórios)
   - `ZOHO_REGION`: `com` se sua conta usa `accounts.zoho.com`; caso use outro data center, escolha `eu`, `in`, `com.au`, `jp`, `ca`, `com.cn`, `ae` ou `sa` conforme a conta.
   - `ZOHO_REDIRECT_URI`: opcional, normalmente use a URL registrada acima.
5. Publique o projeto após configurar as variáveis.
6. Faça login em `https://bawerk.solutions/admin`, abra **E-mails Zoho** e clique **Autorizar conta Zoho**.
7. Faça login na conta que realmente possui `contato@bawerk.solutions` e autorize o acesso à leitura.

O OAuth solicita apenas:
`ZohoMail.accounts.READ,ZohoMail.folders.READ,ZohoMail.messages.READ`.

A aplicação grava **somente o refresh token criptografado com AES-256-GCM** no Neon. O token e a chave de criptografia ficam no servidor. As rotas da caixa de entrada exigem autenticação administrativa.

**Importante:** se `contato@bawerk.solutions` for apenas um alias ou grupo, verifique se esse endereço está entre os endereços da conta autorizada. A primeira autorização pode falhar caso o usuário escolhido não tenha esse endereço associado.

## 3. Situação funcional

- Login administrativo seguro: implementação incluída; exige variáveis próprias.
- OAuth Zoho e lista de mensagens: implementação incluída; exige autorização real.
- Leitura do conteúdo: por segurança, renderizada como texto, sem HTML remoto e pixels de rastreamento.
- Envio e resposta de e-mails: **ainda desativados**. Exigirão escopos adicionais e nova revisão.
- Anexos: backend de download ainda não incluído.
- Mensagens de demonstração: nenhuma será apresentada como se fosse recebida.

## 4. Diagnóstico

Se o painel informar que a autenticação não foi configurada, confira `ADMIN_SECRET` e `ADMIN_PASSWORD_HASH`. Se a Zoho indicar variáveis ausentes, confira os valores de ambiente. Para erros de OAuth, confirme região, Client ID, Secret, callback e autorização da conta correta. Não coloque segredos em issue pública, screenshot ou log.

Atenção: isto é preparação da integração. O acesso real à sua caixa de entrada só será comprovado após a autorização pelo titular no Zoho.
