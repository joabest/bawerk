# Google Analytics 4 + Microsoft Clarity + relatórios internos

## Implementado
- GA4: identificador **G-91BEZ30Z23** carregado somente após aceite de cookies analíticos.
- A tag é inserida uma única vez no `<head>` pelo layout global, e eventos de visualização são enviados a cada mudança de rota pública do Next.js.
- Não há scripts de GA4/Clarity no `/admin` ou `/admin/preview`.
- O Clarity pode ser ativado ao adicionar `NEXT_PUBLIC_CLARITY_PROJECT_ID` às variáveis de ambiente da Vercel (o valor é o Project ID mostrado no script do Clarity).
- Botão flutuante no rodapé esquerdo permite revisar/retirar consentimento. A recusa impede a inicialização de scripts analíticos.
- Contador interno BAWERK monitora visitas consentidas e tempo de aba visível por rota em `bawerk_page_engagement` no Neon.
- Menu **Análise do site** no `/admin`: visitas, sessões, tempo médio por página e por sessão, evolução diária, origem, dispositivos e ranking de páginas (7/30/90 dias).

## Variáveis
- `DATABASE_URL` (ou `POSTGRES_URL`): banco Neon já usado pelo projeto; necessário para os relatórios internos.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` opcional. O padrão no código já é `G-91BEZ30Z23`.
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`: **ainda não configurado**, fornecer o ID do projeto Clarity.
- `ADMIN_SECRET` e `ADMIN_PASSWORD_HASH`: manter configurados para acesso ao painel real.

## Como testar
1. Abra https://bawerk.solutions em janela anônima. Aceite cookies analíticos.
2. Navegue entre home, serviços, aplicativos, blog e contato. Não deixe a aba em segundo plano durante o teste de tempo.
3. Consulte a extensão Tag Assistant / tempo real do GA4. Em `/admin`, abra **Análise do site**.
4. Se os relatórios estiverem vazios, confirme a variável de banco e tente novamente após registrar visitas consentidas.
5. A prévia visual https://bawerk.solutions/admin/preview mostra números fictícios, não dados reais.

## Limites e privacidade
O relatório dentro do /admin é **interno**. Ele não utiliza a API de relatórios do Google Analytics, e portanto seus números podem divergir do GA4 (bloqueadores, consentimento, sessão, processamento, dados históricos). O tempo é medido pela atividade visível da aba, com atualizações aproximadas a cada 15 segundos e envio ao sair da página. Não há gravação de formulários, textos digitados, captura de tela ou dados pessoais nessa tabela. O rastreamento anterior automático do site foi substituído para evitar coletas duplicadas sem consentimento. Relatórios antigos de origem de visitas podem continuar no banco legado, mas não são misturados aos novos indicadores de engajamento.

Para adicionar relatórios oficiais do GA4 diretamente ao admin no futuro, será necessário o **GA4 Property ID** numérico e uma credencial de API com acesso de leitura, armazenada no servidor. O Measurement ID `G-91BEZ30Z23` sozinho não dá acesso ao Analytics Data API.
