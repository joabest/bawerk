import type { BlogPost } from './blog-data'

// Edição de 25/11/2026. Guias originais da Bawerk com foco em decisões práticas.
export const newArticles: BlogPost[] = [
{
 slug:'seguranca-apis-autenticacao-rate-limit',title:'Segurança de APIs: autenticação, permissões e limites de acesso',category:'SOFTWARE',theme:'azure',symbol:'API',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Um guia para proteger integrações empresariais com autenticação adequada, autorização por recurso, limites de requisições e registros úteis.',
 body:[
  {heading:'Autenticar não é autorizar',paragraphs:[
   'Uma API pode confirmar corretamente a identidade de alguém e ainda assim expor informações indevidas. Autenticação responde quem fez a solicitação; autorização determina quais ações aquela identidade pode executar. Por isso, cada operação que recebe um identificador de cliente, pedido ou documento deve verificar o vínculo entre a identidade e aquele recurso.',
   'Prefira políticas explícitas por função e por recurso. Evite confiar no identificador enviado pelo navegador ou aceitar que um usuário escolha livremente a empresa em nome da qual está operando. Em aplicações multitenant, o escopo da empresa deve ser conferido no servidor em cada consulta e alteração.'
  ]},
  {heading:'Chaves, tokens e credenciais precisam de ciclo de vida',paragraphs:[
   'Chaves de integração devem ficar no ambiente do servidor, fora de código público e de aplicativos distribuídos. Defina permissões mínimas, prazo de validade quando possível e um procedimento para substituição imediata em caso de vazamento.',
   'Na comunicação entre serviços, use HTTPS e valide assinatura de webhooks antes de processar eventos. Para webhooks, trate mensagens repetidas com idempotência: receber a mesma confirmação duas vezes não pode gerar duas cobranças ou dois cadastros.'
  ]},
  {heading:'Rate limit e validação de dados reduzem abuso',paragraphs:[
   'Um limite de requisições por usuário, chave e endereço de origem ajuda a controlar consumo e tentativas automatizadas. Esse mecanismo não substitui autorização, mas protege endpoints caros, como envio de mensagens, consulta de dados e geração de relatórios.',
   'Valide formato, tamanho e tipo de todos os campos antes de acessar o banco. Mensagens de erro devem orientar o integrador sem revelar detalhes internos de tabelas, credenciais ou infraestrutura.'
  ]},
  {heading:'Como testar antes de publicar',paragraphs:[
   'Monte testes com pelo menos dois usuários de empresas diferentes e tente acessar recursos cruzados. Verifique também tokens expirados, requisições sem autenticação, repetição de webhooks e carga acima dos limites previstos.',
   'Mantenha logs com identificador de requisição, operação, duração e resultado, mas evite registrar senhas e tokens. Uma revisão periódica de acessos e dependências fecha o ciclo entre desenvolvimento, operação e segurança.'
  ]}
 ]
},
{
 slug:'acessibilidade-sites-empresariais',title:'Acessibilidade em sites empresariais: melhorias que beneficiam todos',category:'DESIGN',theme:'violet',symbol:'UX',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Contraste, navegação por teclado, formulários e conteúdo legível: como criar experiências inclusivas sem sacrificar a identidade visual.',
 body:[
  {heading:'Acessibilidade começa na estrutura',paragraphs:[
   'Um site acessível não depende apenas de um botão de aumentar letras. A organização semântica da página ajuda leitores de tela, tecnologias assistivas e até pessoas que navegam sem mouse. Use títulos em hierarquia coerente, botões para ações e links para navegação.',
   'Menus, modais e componentes personalizados precisam comunicar seu estado. Um botão que abre opções deve indicar se está expandido; um modal precisa receber foco e permitir fechamento pelo teclado sem deixar a pessoa perdida no conteúdo atrás dele.'
  ]},
  {heading:'Legibilidade antes de efeitos visuais',paragraphs:[
   'Texto sobre imagem, superfícies translúcidas e detalhes em azul neon podem funcionar bem visualmente, mas precisam de contraste suficiente. Avalie o contraste na condição real: com brilho de tela baixo, em celular e sobre fundos variáveis.',
   'Evite transmitir informação somente pela cor. Erros de formulário devem apresentar mensagens claras, além de bordas vermelhas. Animações decorativas devem respeitar a preferência do sistema por movimento reduzido.'
  ]},
  {heading:'Formulários devem ajudar, não confundir',paragraphs:[
   'Associe cada campo a um rótulo visível, indique quais dados são obrigatórios e apresente erros próximos ao campo correspondente. O placeholder pode trazer um exemplo, mas não deve substituir o nome do campo.',
   'Após o envio, mostre uma confirmação objetiva ou explique o que precisa ser corrigido. Máscaras de telefone e CPF não podem impedir colagem, edição ou uso por tecnologias assistivas.'
  ]},
  {heading:'Uma rotina simples de avaliação',paragraphs:[
   'Faça uma navegação completa usando apenas Tab, Shift+Tab, Enter e Escape. Verifique se o foco está visível e se todos os controles podem ser alcançados. Em seguida, use um leitor de tela e inspecione descrições de imagens e nomes de botões.',
   'Ferramentas automáticas identificam parte dos problemas, mas não substituem testes manuais. Priorize correções nas jornadas essenciais: localizar um serviço, entender a proposta e entrar em contato.'
  ]}
 ]
},
{
 slug:'observabilidade-sites-sistemas-alertas',title:'Monitoramento de sites e sistemas: o que medir antes de surgir uma falha',category:'SOFTWARE',theme:'blue',symbol:'OPS',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Aprenda a diferenciar métricas, logs, rastreamento e alertas para descobrir problemas de produção antes que prejudiquem clientes.',
 body:[
  {heading:'Estar online não significa funcionar bem',paragraphs:[
   'Um teste que recebe resposta 200 na página inicial não garante que o formulário envia mensagens, que o login aceita sessões ou que o checkout confirma pagamentos. O monitoramento deve observar tanto disponibilidade quanto jornadas de negócio essenciais.',
   'Comece identificando três ou quatro ações que não podem falhar. Para cada uma, descreva o resultado esperado, o ponto de falha mais comum e quem precisa ser acionado quando ocorrer um problema.'
  ]},
  {heading:'Métricas, logs e rastreamento cumprem funções diferentes',paragraphs:[
   'Métricas mostram tendências, como latência, volume de requisições, taxa de erro e consumo de recursos. Logs registram eventos específicos. Rastreamento distribuído ajuda a acompanhar uma solicitação que atravessa API, autenticação, serviços externos e banco de dados.',
   'Use identificadores de correlação para investigar uma reclamação sem pesquisar dados pessoais nos registros. Uma requisição lenta pode ter começado no navegador, esperado uma integração externa e terminado em uma consulta demorada ao banco.'
  ]},
  {heading:'Alertas devem indicar uma ação possível',paragraphs:[
   'Enviar dezenas de notificações para qualquer oscilação cria ruído. Defina alertas por impacto: aumento persistente de erros, falha no envio de leads, filas acumuladas ou degradação significativa da experiência.',
   'Cada alerta deve explicar o serviço afetado, quando começou e qual painel ou procedimento consultar. Se ninguém sabe o que fazer ao receber uma notificação, a regra precisa ser revisada.'
  ]},
  {heading:'Transforme incidentes em melhorias',paragraphs:[
   'Depois de corrigir uma falha, registre o sintoma, a causa identificada, a solução e como detectar o mesmo problema mais cedo. O objetivo não é procurar culpados, mas reduzir recorrência e tempo de recuperação.',
   'Uma rotina mensal de revisão de incidentes e dependências externas ajuda a manter o sistema sustentável. Monitoramento é parte do produto, não um acessório instalado depois do lançamento.'
  ]}
 ]
},
{
 slug:'automacao-orcamentos-follow-up-vendas',title:'Automação de orçamentos: como acompanhar propostas sem perder oportunidades',category:'CRM',theme:'green',symbol:'CRM',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Organize a passagem do formulário ao CRM, defina responsáveis e automatize lembretes de acompanhamento sem pressionar clientes.',
 body:[
  {heading:'O orçamento precisa ter um histórico único',paragraphs:[
   'Quando solicitações chegam por WhatsApp, formulário e e-mail, é comum criar planilhas paralelas ou esquecer uma conversa. O primeiro passo é registrar cada oportunidade com origem, contato, serviço solicitado, valor estimado, responsável e data da próxima ação.',
   'Evite duplicações ao vincular mensagens ao mesmo cliente e à mesma proposta. Histórico de alterações ajuda a entender se um preço foi revisado, quem respondeu e por que a negociação avançou ou parou.'
  ]},
  {heading:'Etapas simples tornam a operação visível',paragraphs:[
   'Um fluxo inicial pode conter solicitação recebida, levantamento de necessidades, proposta enviada, negociação e resultado. Acrescente etapas somente quando representarem decisões reais. Um funil complicado tende a ficar desatualizado.',
   'Defina critérios claros para mover a proposta. Por exemplo: “proposta enviada” exige registro do documento e da data de envio; “ganho” exige confirmação do cliente; “perdido” deve registrar um motivo quando possível.'
  ]},
  {heading:'Lembretes não são disparos indiscriminados',paragraphs:[
   'Automatize a tarefa de lembrar o vendedor sobre propostas sem resposta. Isso não significa enviar mensagens automáticas ilimitadas aos clientes. Respeite consentimento, horário de contato e preferência de canal.',
   'Uma boa regra envolve responsável, intervalo e condição de parada. Se o cliente responder ou recusar a proposta, a sequência deve ser encerrada. Mensagens personalizadas e oportunas são mais úteis do que volume.'
  ]},
  {heading:'Indicadores que mostram o gargalo',paragraphs:[
   'Acompanhe tempo até a primeira resposta, propostas emitidas, proporção de negociações concluídas, valor em aberto e motivos de perda. Compare resultados por canal e por tipo de serviço antes de tirar conclusões.',
   'Comece com um processo pequeno, teste com a equipe e ajuste as automações a partir de situações reais. O software deve facilitar o trabalho comercial, não apenas adicionar uma nova tela para preencher.'
  ]}
 ]
},
{
 slug:'custo-total-software-manutencao',title:'Custo total de um software: o que considerar depois do desenvolvimento',category:'INSIGHTS',theme:'orange',symbol:'TCO',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Hospedagem, suporte, integrações, evolução e segurança fazem parte do investimento; veja como planejar custos além do orçamento inicial.',
 body:[
  {heading:'O lançamento é uma etapa, não a linha de chegada',paragraphs:[
   'O orçamento de desenvolvimento explica quanto custa construir uma primeira versão. Mas um sistema em operação também usa hospedagem, banco de dados, serviços de e-mail, armazenamento, monitoramento e suporte. Essas despesas mudam conforme o número de usuários e o volume de trabalho.',
   'Separe custos recorrentes de custos eventuais. Um serviço de mensagens pode cobrar por uso, enquanto a manutenção de uma integração pode surgir quando um fornecedor altera sua API.'
  ]},
  {heading:'Inclua manutenção corretiva e evolutiva',paragraphs:[
   'Manutenção corretiva resolve problemas que impedem a operação; manutenção evolutiva acompanha novas necessidades. Ambas precisam de prioridade, critérios de aceite e tempo reservado para testes.',
   'Bibliotecas e plataformas mudam com o tempo. Atualizações de dependências, revisão de permissões e backups testados reduzem o risco de um sistema aparentemente estável acumular fragilidades.'
  ]},
  {heading:'Calcule o retorno com base no trabalho real',paragraphs:[
   'Para estimar retorno, observe horas economizadas, retrabalho reduzido, oportunidades recuperadas e erros evitados. Uma automação que economiza poucos minutos em milhares de atendimentos pode ter impacto diferente de uma funcionalidade complexa usada raramente.',
   'Não atribua todo aumento de faturamento ao software sem analisar outros fatores. Prefira metas verificáveis e compare uma linha de base com o resultado após a implantação.'
  ]},
  {heading:'Como montar um orçamento sustentável',paragraphs:[
   'Documente escopo inicial, usuários previstos, integrações, limites de uso, política de suporte e requisitos de segurança. Inclua uma reserva para mudanças e uma revisão periódica dos custos de infraestrutura.',
   'Essa clareza ajuda a escolher entre ferramenta pronta, integração ou desenvolvimento sob medida. A opção mais barata no primeiro mês nem sempre é a mais econômica ao longo do ciclo de vida.'
  ]}
 ]
},
{
 slug:'ia-dados-internos-permissoes-qualidade',title:'IA com dados internos da empresa: como preparar informações e permissões',category:'IA',theme:'violet',symbol:'DATA',readMinutes:7,publishedAt:'2026-11-25',
 summary:'Antes de conectar um assistente de IA ao CRM e aos documentos, organize fontes, controles de acesso, qualidade de dados e avaliação de respostas.',
 body:[
  {heading:'O problema costuma começar antes do modelo',paragraphs:[
   'Se políticas comerciais estão desatualizadas, documentos se contradizem e registros do CRM têm campos vazios, um assistente de IA pode reproduzir a confusão com aparência de segurança. O primeiro trabalho é identificar fontes oficiais, responsáveis pela atualização e regras de uso.',
   'Classifique os dados conforme sensibilidade e finalidade. Informações públicas de serviços não exigem o mesmo tratamento que propostas comerciais, documentos pessoais ou dados de clientes.'
  ]},
  {heading:'A recuperação deve respeitar as permissões existentes',paragraphs:[
   'Sistemas de busca semântica podem localizar trechos relevantes em uma base de conhecimento. Mas encontrar o trecho certo não significa que ele possa ser mostrado a qualquer pessoa. As permissões do usuário precisam ser aplicadas antes da recuperação ou na seleção de resultados.',
   'Não use um único índice compartilhado sem considerar a separação entre empresas, equipes e funções. Uma pessoa do suporte não deve receber contratos confidenciais apenas porque uma pergunta contém palavras semelhantes.'
  ]},
  {heading:'Respostas precisam ser verificáveis',paragraphs:[
   'Sempre que viável, apresente referência ao documento utilizado e sinalize quando uma resposta não estiver sustentada pela base. Determine situações em que o agente deve encaminhar para revisão humana, especialmente antes de executar ações com efeito financeiro ou contratual.',
   'Teste perguntas ambíguas, dados desatualizados e solicitações fora da permissão do usuário. Avalie não apenas fluidez do texto, mas fidelidade às fontes, recusa apropriada e proteção de informações.'
  ]},
  {heading:'Comece pequeno e acompanhe resultados',paragraphs:[
   'Escolha um conjunto restrito de documentos, uma equipe piloto e perguntas frequentes. Meça qualidade das respostas, tempo poupado e quantidade de encaminhamentos necessários. Amplie apenas quando as regras de acesso e a atualização das fontes estiverem funcionando.',
   'IA corporativa útil combina engenharia de dados, segurança, experiência do usuário e operação contínua. A escolha do modelo é importante, mas não substitui esses fundamentos.'
  ]}
 ]
}
]
