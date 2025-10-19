// Types
export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Example {
  title: string;
  scenario: string;
  key_point?: string;
  warning?: string;
}

export interface Criterion {
  name: string;
  description: string;
  tip?: string;
}

export interface Profile {
  type: string;
  characteristics: string[];
  ideal_for: string;
}

export interface Section {
  title?: string;
  description?: string;
  items?: string[];
  example?: Example;
  features?: string[];
  steps?: string[];
  criteria?: Criterion[];
  profiles?: Profile[];
  warnings?: string[];
  image?: string;
  recommendations?: string[];
  limits?: string[];
  best_practices?: string[];
  approach?: Array<{
    name: string;
    allocation: string;
    benefit: string;
  }>;
  rules?: Array<{
    rule: string;
    description: string;
    example?: string;
    action?: string;
    benefit?: string;
  }>;
  techniques?: Array<{
    name: string;
    description: string;
    example: string;
  }>;
  benefits?: Array<{
    name: string;
    description: string;
    impact: string;
  }>;
  risks?: Array<{
    name: string;
    description: string;
    mitigation: string;
  }>;
  statistics?: Array<{
    fact: string;
    context: string;
    lesson: string;
  }>;
  summary?: string[];
  steps_detailed?: Array<{
    step: string;
    action: string;
    time: string;
  }>;
  mindset?: Array<{
    principle: string;
    description: string;
    action: string;
  }>;
  resources?: string[];
  message?: string;
  analysis_checklist?: string[];
  frequency?: string[];
  tools?: string[];
  strategy?: string[];
  documents?: string[];
  methods?: string[];
}

export interface ChapterContent {
  intro?: string;
  sections?: Section[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  icon: string;
  image?: string;
  content: ChapterContent;
  checklist: ChecklistItem[];
}

export interface EbookData {
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

// Data
export const ebookData: EbookData = {
  title: "Copy Trading na Exness: O Guia Completo para Iniciantes",
  subtitle: "Aprenda a investir copiando estratégias de traders profissionais",
  chapters: [
    {
      id: "intro",
      number: 0,
      title: "Introdução",
      icon: "BookOpen",
      image: "/images/hero-copytrading.png",
      content: {
        intro: "Investir pode parecer complicado, mas o **Copy Trading** simplifica tudo. Com ele, você não precisa ser especialista em análise de gráficos: basta escolher um trader experiente e **copiar automaticamente as operações** dele.",
        sections: [
          {
            title: "O que você vai aprender",
            items: [
              "O que é Copy Trading e como funciona",
              "Como funciona dentro da Exness",
              "Como escolher traders confiáveis",
              "Estratégias para começar com pouco e com segurança",
              "Gestão de risco e proteção do capital",
              "Ferramentas práticas para acompanhar seus resultados"
            ]
          },
          {
            title: "Para quem é este guia",
            description: "Este ebook foi criado para **iniciantes** que querem começar a investir sem precisar se tornar especialistas em análise técnica. Se você quer aprender uma forma mais acessível de investir, este guia é para você."
          }
        ]
      },
      checklist: []
    },
    {
      id: "cap1",
      number: 1,
      title: "O que é Copy Trading?",
      icon: "Copy",
      image: "/images/concept-mirror.png",
      content: {
        intro: "Copy Trading é um sistema em que você conecta sua conta à de um trader profissional. Todas as operações feitas por ele são **replicadas automaticamente** na sua conta.",
        sections: [
          {
            title: "Como funciona na prática",
            description: "Imagine que você está \"espelhando\" as ações de um trader experiente. Quando ele compra EUR/USD, sua conta também compra automaticamente. Quando ele vende, você vende. Tudo isso acontece em **tempo real**, sem que você precise fazer nada manualmente.",
            example: {
              title: "Exemplo Prático",
              scenario: "Você investe R$100 e o trader profissional opera com R$10.000. Se ele ganhar 10% em uma operação, você também ganha 10% sobre seu capital (R$10). Se ele perder 5%, você perde 5% (R$5).",
              key_point: "A proporção é mantida, mas você controla quanto deseja investir."
            }
          },
          {
            title: "Explicação Técnica",
            description: "O Copy Trading utiliza **APIs** (interfaces de programação) das corretoras para replicar operações em tempo real. Cada operação do trader é automaticamente copiada proporcionalmente ao capital que você alocou. O sistema calcula o tamanho da posição baseado na proporção entre seu capital e o capital do trader."
          },
          {
            title: "Pontos Importantes",
            items: [
              "Você mantém **controle total** sobre seu dinheiro",
              "Pode pausar ou encerrar a cópia **a qualquer momento**",
              "O trader **não tem acesso** ao seu capital",
              "Seu dinheiro funciona como **margem de proteção**",
              "Você define limites de risco (Stop Loss, Take Profit)"
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap1-1",
          text: "Entendi que Copy Trading é espelhar um trader experiente"
        },
        {
          id: "cap1-2",
          text: "Sei que posso parar ou ajustar minha cópia a qualquer hora"
        },
        {
          id: "cap1-3",
          text: "Entendi que meu capital é minha margem de proteção"
        },
        {
          id: "cap1-4",
          text: "Compreendi que o trader não mexe no meu dinheiro"
        }
      ]
    },
    {
      id: "cap2",
      number: 2,
      title: "Como funciona na Exness",
      icon: "TrendingUp",
      image: "/images/trader-selection.png",
      content: {
        intro: "A Exness oferece uma plataforma de Copy Trading integrada com recursos profissionais e interface amigável para iniciantes.",
        sections: [
          {
            title: "1. Marketplace de Traders",
            description: "Uma listagem completa de traders com dados estatísticos detalhados que permitem análise quantitativa e qualitativa de performance.",
            features: [
              "**Percentual de lucro** acumulado e mensal",
              "**Drawdown** (maior queda de capital)",
              "**Número de copiadores** (prova social)",
              "**Alavancagem utilizada** pelo trader",
              "**Frequência de operações** (quantas trades por dia/semana)",
              "**Ativos negociados** (pares de moedas, commodities, etc.)",
              "**Histórico completo** de operações"
            ]
          },
          {
            title: "2. Configuração de Cópia",
            description: "O processo de configuração é simples e intuitivo:",
            steps: [
              "Selecione um trader da lista",
              "Defina o valor que deseja investir",
              "Configure Stop Loss e Take Profit automáticos (opcional)",
              "Escolha se quer copiar operações já abertas",
              "Ative a cópia com um clique"
            ]
          },
          {
            title: "3. Monitoramento em Tempo Real",
            description: "Acompanhe todas as operações em tempo real através do painel da Exness:",
            features: [
              "Visualização de todas as operações ativas",
              "Histórico completo de trades",
              "Gráficos de performance",
              "Lucro/prejuízo em tempo real",
              "Notificações de novas operações"
            ]
          },
          {
            title: "4. Controle Total",
            items: [
              "Pause a cópia a qualquer momento",
              "Encerre operações individuais se desejar",
              "Ajuste o valor investido",
              "Copie múltiplos traders simultaneamente",
              "Defina limites de perda diária/semanal"
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap2-1",
          text: "Explorei o Marketplace de Traders da Exness"
        },
        {
          id: "cap2-2",
          text: "Entendi como configurar uma cópia"
        },
        {
          id: "cap2-3",
          text: "Sei como monitorar operações em tempo real"
        },
        {
          id: "cap2-4",
          text: "Compreendi que tenho controle total sobre minha conta"
        }
      ]
    },
    {
      id: "cap3",
      number: 3,
      title: "Como Escolher um Trader",
      icon: "UserCheck",
      image: "/images/trader-selection.png",
      content: {
        intro: "Nem todo trader serve para todos. A escolha do trader certo é **fundamental** para o sucesso no Copy Trading.",
        sections: [
          {
            title: "Critérios Essenciais",
            criteria: [
              {
                name: "Histórico de Ganhos",
                description: "Consistência é mais importante que picos altos. Procure traders com lucro **constante** ao longo de vários meses, não apenas um mês excepcional.",
                tip: "Prefira um trader com +5% ao mês consistente do que um com +50% em um mês e -30% no outro."
              },
              {
                name: "Drawdown",
                description: "Drawdown é a **maior queda** de capital que o trader já teve. Quanto menor, melhor. Evite traders com drawdown acima de 30%.",
                tip: "Um drawdown de 50% significa que o trader perdeu metade do capital em algum momento. Isso é muito arriscado!"
              },
              {
                name: "Tempo de Atividade",
                description: "Traders novos podem ser arriscados. Prefira traders com **pelo menos 6 meses** de histórico verificado.",
                tip: "Um trader com 1 ano de histórico positivo é muito mais confiável que um com 1 mês."
              },
              {
                name: "Número de Copiadores",
                description: "Mais copiadores geralmente indica mais confiança da comunidade. Mas não use isso como único critério.",
                tip: "Um trader com 500+ copiadores geralmente é mais estável, mas sempre analise os outros critérios."
              },
              {
                name: "Frequência de Operações",
                description: "Traders que operam demais (scalpers) podem gerar muitas taxas. Traders que operam pouco podem não aproveitar oportunidades.",
                tip: "Procure um equilíbrio: 2-10 operações por semana é razoável para iniciantes."
              }
            ]
          },
          {
            title: "Perfis de Risco",
            profiles: [
              {
                type: "Conservador",
                characteristics: [
                  "Drawdown máximo: 10-15%",
                  "Retorno esperado: 3-8% ao mês",
                  "Alavancagem: 1:10 ou menor",
                  "Frequência: 5-15 trades/mês"
                ],
                ideal_for: "Iniciantes que querem segurança"
              },
              {
                type: "Moderado",
                characteristics: [
                  "Drawdown máximo: 15-25%",
                  "Retorno esperado: 8-15% ao mês",
                  "Alavancagem: 1:20",
                  "Frequência: 15-30 trades/mês"
                ],
                ideal_for: "Quem já tem alguma experiência"
              },
              {
                type: "Agressivo",
                characteristics: [
                  "Drawdown máximo: 25-40%",
                  "Retorno esperado: 15-30% ao mês",
                  "Alavancagem: 1:50 ou maior",
                  "Frequência: 30+ trades/mês"
                ],
                ideal_for: "Experientes que aceitam alto risco"
              }
            ]
          },
          {
            title: "Sinais de Alerta (Red Flags)",
            warnings: [
              "Promessas de ganhos garantidos (ninguém garante lucro)",
              "Drawdown acima de 50% (risco extremo)",
              "Histórico muito curto (menos de 3 meses)",
              "Operações muito frequentes sem critério (overtrading)",
              "Alavancagem extrema (1:100 ou mais)",
              "Falta de transparência nos dados"
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap3-1",
          text: "Analisei o histórico de ganhos do trader"
        },
        {
          id: "cap3-2",
          text: "Verifiquei o drawdown máximo"
        },
        {
          id: "cap3-3",
          text: "Confirmei que o trader tem pelo menos 6 meses de histórico"
        },
        {
          id: "cap3-4",
          text: "Identifiquei meu perfil de risco (conservador/moderado/agressivo)"
        },
        {
          id: "cap3-5",
          text: "Verifiquei se não há sinais de alerta"
        }
      ]
    },
    {
      id: "cap4",
      number: 4,
      title: "Conceitos Fundamentais",
      icon: "BookMarked",
      image: "/images/alavancagem-concept.png",
      content: {
        intro: "Para ter sucesso no Copy Trading, você precisa entender alguns conceitos fundamentais que fazem toda a diferença.",
        sections: [
          {
            title: "Alavancagem",
            image: "/images/alavancagem-concept.png",
            description: "Alavancagem é como um **multiplicador** do seu capital. Com alavancagem 1:10, você pode operar como se tivesse 10x mais dinheiro.",
            example: {
              title: "Exemplo Prático",
              scenario: "Com R$100 e alavancagem 1:10, você pode abrir uma posição de R$1.000. Se ganhar 5%, você ganha R$50 (50% do seu capital). Mas se perder 5%, você perde R$50 (50% do seu capital).",
              warning: "Alavancagem amplifica **ganhos E perdas**!"
            },
            recommendations: [
              "Iniciantes: use alavancagem 1:10 ou menor",
              "Intermediários: 1:20 é aceitável",
              "Evite alavancagem acima de 1:50"
            ]
          },
          {
            title: "Drawdown",
            image: "/images/drawdown-concept.png",
            description: "Drawdown é a **maior queda** de capital que você teve em relação ao pico anterior. É uma medida de risco muito importante.",
            example: {
              title: "Exemplo Prático",
              scenario: "Você tinha R$1.000 e chegou a R$1.200 (pico). Depois caiu para R$900. Seu drawdown é de 25% (queda de R$1.200 para R$900).",
              key_point: "Quanto menor o drawdown, mais segura é a estratégia."
            },
            limits: [
              "Drawdown de 10%: Muito seguro",
              "Drawdown de 20%: Aceitável",
              "Drawdown de 30%: Alto risco",
              "Drawdown de 50%: Extremamente arriscado"
            ]
          },
          {
            title: "Stop Loss Automático",
            image: "/images/stop-loss-concept.png",
            description: "Stop Loss é uma **ordem automática** que fecha sua posição quando a perda atinge um limite definido por você. É sua principal proteção!",
            example: {
              title: "Exemplo Prático",
              scenario: "Você define Stop Loss de 5%. Se uma operação começar a perder e atingir -5%, ela é automaticamente fechada, limitando sua perda.",
              key_point: "Sempre use Stop Loss! Nunca opere sem proteção."
            },
            best_practices: [
              "Defina Stop Loss antes de abrir qualquer operação",
              "Use Stop Loss de 2-5% para operações individuais",
              "Configure Stop Loss diário de 10% no máximo",
              "Nunca mova o Stop Loss para aumentar perda"
            ]
          },
          {
            title: "Take Profit",
            description: "Take Profit é o oposto do Stop Loss: fecha automaticamente quando você atinge o **lucro desejado**.",
            example: {
              title: "Exemplo Prático",
              scenario: "Você define Take Profit de 10%. Quando a operação atingir +10% de lucro, ela é automaticamente fechada, garantindo seu ganho.",
              key_point: "Garanta lucros antes que o mercado reverta!"
            },
            recommendations: [
              "Use proporção 1:2 (risco:recompensa)",
              "Se Stop Loss é 5%, Take Profit deve ser 10%",
              "Não seja ganancioso: lucro garantido é melhor que lucro potencial"
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap4-1",
          text: "Entendi o conceito de alavancagem e seus riscos"
        },
        {
          id: "cap4-2",
          text: "Sei o que é drawdown e como analisá-lo"
        },
        {
          id: "cap4-3",
          text: "Compreendi a importância do Stop Loss"
        },
        {
          id: "cap4-4",
          text: "Sei como usar Take Profit para garantir lucros"
        }
      ]
    },
    {
      id: "cap5",
      number: 5,
      title: "Passo a Passo Completo",
      icon: "ListChecks",
      image: "/images/checklist-success.png",
      content: {
        intro: "Agora que você entende os conceitos, vamos ao passo a passo prático para começar no Copy Trading da Exness.",
        sections: [
          {
            title: "1. Criar Conta na Exness",
            steps: [
              "Acesse o site oficial da Exness",
              "Clique em 'Abrir Conta'",
              "Preencha seus dados pessoais (nome, email, telefone)",
              "Escolha tipo de conta: **Standard** ou **Pro** (ambas aceitam Copy Trading)",
              "Crie uma senha forte",
              "Confirme seu email"
            ]
          },
          {
            title: "2. Validar Identidade (KYC)",
            description: "KYC (Know Your Customer) é obrigatório por regulamentação. Você precisa enviar:",
            documents: [
              "Documento de identidade (RG ou CNH)",
              "Comprovante de residência (conta de luz, água, etc.)",
              "Selfie segurando o documento"
            ]
          },
          {
            title: "3. Fazer Depósito Inicial",
            description: "Deposite apenas o que você pode arriscar sem comprometer sua vida financeira.",
            methods: [
              "PIX (instantâneo, sem taxas)",
              "Cartão de crédito/débito",
              "Transferência bancária",
              "Carteiras digitais"
            ],
            recommendations: [
              "Iniciantes: comece com R$200-500",
              "Intermediários: R$500-2000",
              "Nunca deposite dinheiro que você precisa para contas essenciais"
            ]
          },
          {
            title: "4. Acessar o Marketplace de Traders",
            steps: [
              "No painel da Exness, clique em 'Copy Trading'",
              "Explore a lista de traders disponíveis",
              "Use os filtros: retorno, drawdown, tempo de atividade",
              "Analise pelo menos 5-10 traders antes de escolher",
              "Leia os comentários de outros copiadores"
            ]
          },
          {
            title: "5. Analisar e Escolher Trader",
            analysis_checklist: [
              "Histórico de pelo menos 6 meses",
              "Drawdown máximo abaixo de 25%",
              "Retorno consistente (não apenas um mês bom)",
              "Número razoável de copiadores (100+)",
              "Frequência de operações compatível com seu perfil",
              "Alavancagem não muito alta (máximo 1:50)"
            ]
          },
          {
            title: "6. Configurar a Cópia",
            steps: [
              "Clique no trader escolhido",
              "Defina o valor a investir (comece com 20-30% do seu capital)",
              "Configure Stop Loss automático (recomendado: 10-15%)",
              "Configure Take Profit (opcional: 20-30%)",
              "Escolha se quer copiar operações já abertas",
              "Ative 'Checkout na última sexta' (protege de gaps de fim de semana)",
              "Confirme e ative a cópia"
            ]
          },
          {
            title: "7. Monitorar Resultados",
            frequency: [
              "Diário: verifique se há operações abertas",
              "Semanal: analise lucro/perda acumulado",
              "Mensal: avalie se o trader continua performando bem"
            ],
            tools: [
              "Painel da Exness (operações em tempo real)",
              "Planilha de acompanhamento (fornecida neste ebook)",
              "Notificações por email/app"
            ]
          },
          {
            title: "8. Diversificar",
            description: "Nunca coloque todo seu capital em um único trader!",
            strategy: [
              "Divida seu capital em 2-3 traders diferentes",
              "Escolha traders com estratégias diferentes",
              "Exemplo: 40% em conservador, 40% em moderado, 20% em agressivo",
              "Rebalanceie mensalmente conforme resultados"
            ]
          },
          {
            title: "9. Reinvestir com Cautela",
            recommendations: [
              "Retire 50% dos lucros para segurança",
              "Reinvista os outros 50% para crescimento",
              "Mantenha sempre uma reserva de emergência fora do Copy Trading",
              "Não reinvista tudo de uma vez"
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap5-1",
          text: "Criei conta na Exness e validei identidade"
        },
        {
          id: "cap5-2",
          text: "Depositei capital seguro, compatível com meu risco"
        },
        {
          id: "cap5-3",
          text: "Analisei traders no marketplace baseado em critérios"
        },
        {
          id: "cap5-4",
          text: "Configurei Stop Loss e Take Profit"
        },
        {
          id: "cap5-5",
          text: "Ativei 'Checkout na última sexta'"
        },
        {
          id: "cap5-6",
          text: "Diversifiquei copiando 2-3 traders diferentes"
        },
        {
          id: "cap5-7",
          text: "Criei rotina de monitoramento semanal"
        }
      ]
    },
    {
      id: "cap6",
      number: 6,
      title: "Estratégias Avançadas",
      icon: "Target",
      image: "/images/smart-diversification.png",
      content: {
        intro: "Agora que você domina o básico, vamos a estratégias mais avançadas para maximizar resultados e minimizar riscos.",
        sections: [
          {
            title: "Estratégia de Diversificação Inteligente",
            image: "/images/smart-diversification.png",
            description: "Não basta copiar vários traders. É preciso diversificar **estrategicamente** para reduzir riscos e maximizar oportunidades. A diversificação inteligente protege seu capital contra perdas concentradas e aproveita diferentes condições de mercado.",
            approach: [
              {
                name: "Diversificação por Perfil de Risco",
                allocation: "40% Conservador + 40% Moderado + 20% Agressivo",
                benefit: "Equilibra segurança com potencial de ganho. O conservador protege seu capital, o moderado oferece crescimento estável, e o agressivo busca oportunidades de alto retorno."
              },
              {
                name: "Diversificação por Ativos",
                allocation: "Escolha traders que operam ativos diferentes (Forex, Commodities, Índices, Criptomoedas)",
                benefit: "Reduz risco de correlação - quando um mercado cai, outro pode estar subindo. Por exemplo: ouro geralmente sobe quando ações caem."
              },
              {
                name: "Diversificação por Estratégia",
                allocation: "Combine swing traders (longo prazo) com day traders (curto prazo) e scalpers",
                benefit: "Aproveita diferentes condições de mercado. Swing traders capturam tendências longas, day traders aproveitam volatilidade diária."
              },
              {
                name: "Diversificação por Horário",
                allocation: "Traders que operam em sessões diferentes (Asiática, Europeia, Americana)",
                benefit: "Seu portfólio fica ativo 24 horas, aproveitando oportunidades em todos os fusos horários."
              },
              {
                name: "Diversificação Geográfica",
                allocation: "Traders de diferentes países e regiões",
                benefit: "Reduz exposição a eventos locais específicos. Um problema econômico na Europa não afeta traders focados na Ásia."
              }
            ],
            example: {
              title: "Exemplo de Portfólio Diversificado",
              scenario: "Capital total: R$1.000\n\n**Trader A** (Conservador - Forex EUR/USD): R$400 (40%)\n- Drawdown histórico: 12%\n- Retorno médio: 5% ao mês\n- Estratégia: Swing trading\n\n**Trader B** (Moderado - Commodities Ouro): R$400 (40%)\n- Drawdown histórico: 18%\n- Retorno médio: 10% ao mês\n- Estratégia: Day trading\n\n**Trader C** (Agressivo - Criptomoedas BTC): R$200 (20%)\n- Drawdown histórico: 28%\n- Retorno médio: 18% ao mês\n- Estratégia: Scalping",
              key_point: "Com essa diversificação, se o Trader C perder 28% (R$56), você ainda tem 94,4% do capital total protegido pelos outros traders."
            }
          },
          {
            title: "Gestão de Risco Profissional",
            image: "/images/professional-risk.png",
            description: "A gestão de risco é o que separa investidores bem-sucedidos de amadores. Não é sobre evitar riscos completamente, mas sobre **controlá-los de forma inteligente**. Traders profissionais seguem regras rígidas de gestão de risco - você também deve seguir.",
            rules: [
              {
                rule: "Regra dos 2% por Operação",
                description: "Nunca arrisque mais de 2% do seu capital total em uma única operação. Isso garante que você pode errar 50 vezes seguidas antes de perder tudo.",
                example: "Com R$1.000, não arrisque mais de R$20 por trade. Configure Stop Loss para garantir isso.",
                benefit: "Proteção contra sequências de perdas. Mesmo com 10 perdas consecutivas, você ainda tem 80% do capital."
              },
              {
                rule: "Regra do Drawdown Máximo de 20%",
                description: "Se seu drawdown total atingir 20%, pause TODAS as cópias imediatamente e reavalie sua estratégia.",
                action: "Analise o que deu errado: traders ruins? Condições de mercado adversas? Alavancagem alta demais? Ajuste antes de continuar.",
                benefit: "Evita perdas catastróficas. Recuperar 20% de perda requer 25% de ganho. Recuperar 50% requer 100% de ganho!"
              },
              {
                rule: "Regra da Diversificação de 30%",
                description: "Nunca mais de 30% do capital em um único trader, não importa quão bom ele pareça.",
                example: "Com R$1.000, máximo R$300 por trader. Isso força você a ter pelo menos 4 traders diferentes.",
                benefit: "Se um trader falhar completamente, você perde no máximo 30%, não tudo."
              },
              {
                rule: "Regra do Lucro Garantido",
                description: "A cada 20% de lucro acumulado, retire 10% para sua conta bancária.",
                example: "Começou com R$1.000, chegou a R$1.200 (+20%)? Retire R$120 (10% do lucro). Deixe R$1.080 investido.",
                benefit: "Garante que você sempre sai com algo. Mesmo se perder tudo depois, você já lucrou."
              },
              {
                rule: "Regra do Stop Loss Diário",
                description: "Configure um limite de perda diária de 5% do capital. Se atingir, pare de operar naquele dia.",
                action: "Na Exness, configure 'Daily Loss Limit' para pausar automaticamente todas as cópias.",
                benefit: "Evita que um dia ruim destrua semanas de ganhos. Protege contra volatilidade extrema."
              },
              {
                rule: "Regra da Proporção Risco/Recompensa 1:2",
                description: "Para cada R$1 que você arrisca, busque ganhar pelo menos R$2. Configure Stop Loss e Take Profit com essa proporção.",
                example: "Stop Loss em -5%? Take Profit deve estar em +10%. Assim, você pode errar 2 vezes e acertar 1, e ainda lucrar.",
                benefit: "Mesmo com taxa de acerto de 40%, você ainda lucra no longo prazo."
              }
            ],
            example: {
              title: "Aplicando Gestão de Risco na Prática",
              scenario: "João tem R$2.000 para investir. Ele aplica as regras:\n\n1. **Regra dos 2%**: Máximo R$40 de risco por trade\n2. **Regra dos 30%**: Máximo R$600 por trader (precisa de 4 traders)\n3. **Regra do Drawdown**: Se cair para R$1.600, para tudo\n4. **Regra do Lucro**: A cada R$400 de lucro, retira R$200\n\nResultado após 6 meses:\n- Teve 3 traders lucrativos e 1 com perda\n- Drawdown máximo foi de 15% (dentro do limite)\n- Lucro total: R$800 (40%)\n- Retirou R$400 para o banco\n- Capital atual: R$2.400",
              key_point: "Com gestão de risco, João protegeu seu capital e ainda lucrou consistentemente."
            }
          },
          {
            title: "Estratégia de Rebalanceamento Mensal",
            description: "O mercado muda, traders mudam. O que funcionou no mês passado pode não funcionar agora. Rebalanceamento é o processo de **ajustar sua alocação** baseado em performance recente.",
            steps: [
              "No final de cada mês, analise performance de cada trader",
              "Traders com performance ruim (abaixo de 3% ou negativa): reduza alocação em 50% ou pause",
              "Traders com performance boa (entre 5-15%): mantenha alocação atual",
              "Traders com performance excepcional (acima de 20%): cuidado! Pode ser sorte temporária. Não aumente muito.",
              "Procure novos traders para substituir os que foram pausados",
              "Rebalanceie para manter proporção de risco desejada (40-40-20)"
            ],
            example: {
              title: "Exemplo de Rebalanceamento",
              scenario: "**Mês 1:**\n- Trader A (R$400): +8% ✅\n- Trader B (R$400): +12% ✅\n- Trader C (R$200): -5% ❌\n\n**Ação:**\n- Trader A: Manter R$400\n- Trader B: Manter R$400\n- Trader C: Reduzir para R$100 (metade)\n- Buscar Trader D: Alocar R$100\n\n**Mês 2:**\n- Trader A: +6% ✅\n- Trader B: +15% ✅\n- Trader C: -3% ❌ (pausar)\n- Trader D: +10% ✅\n\n**Ação:**\n- Trader C: Pausar completamente\n- Realocar R$100 para Trader D (agora R$200)",
              key_point: "Rebalanceamento contínuo mantém seu portfólio sempre otimizado."
            }
          },
          {
            title: "Estratégia de Proteção de Lucros",
            techniques: [
              {
                name: "Trailing Stop (Stop Loss Móvel)",
                description: "Move o Stop Loss automaticamente conforme o lucro aumenta, garantindo que você nunca perca todo o ganho.",
                example: "Você está com +15% de lucro. Configure Trailing Stop de 10%. Se o lucro cair para +5%, a posição fecha automaticamente, garantindo +5%."
              },
              {
                name: "Escalonamento de Saída Parcial",
                description: "Retire lucros parcialmente em marcos específicos, reduzindo exposição gradualmente.",
                example: "A cada 10% de ganho, retire 25% do lucro:\n- +10%: Retire 25% do lucro (R$25 de R$100)\n- +20%: Retire mais 25% (R$50 de R$200)\n- +30%: Retire mais 25% (R$75 de R$300)"
              },
              {
                name: "Reinvestimento Progressivo Controlado",
                description: "Reinvista apenas uma porcentagem dos lucros, nunca tudo.",
                example: "Lucrou R$200? Retire R$100 (50%) para o banco e reinvista R$100 (50%). Assim você garante lucro real e ainda cresce o capital."
              },
              {
                name: "Hedge com Traders Opostos",
                description: "Use traders com estratégias opostas para se proteger em diferentes cenários de mercado.",
                example: "Trader A: Compra EUR/USD (bullish)\nTrader B: Vende EUR/USD (bearish)\nQuando um perde, o outro ganha, reduzindo volatilidade total."
              }
            ]
          },
          {
            title: "Estratégia de Crescimento Sustentável",
            description: "Crescer rápido demais é perigoso. Crescimento sustentável é melhor que crescimento explosivo.",
            best_practices: [
              "**Mês 1-3**: Foco em aprender e proteger capital. Meta: não perder.",
              "**Mês 4-6**: Começar a buscar retornos consistentes. Meta: 5-8% ao mês.",
              "**Mês 7-12**: Otimizar estratégias. Meta: 8-12% ao mês.",
              "**Após 1 ano**: Considerar aumentar capital gradualmente. Meta: 10-15% ao mês.",
              "Nunca aumente capital em mais de 50% de uma vez.",
              "Sempre mantenha reserva de emergência fora do Copy Trading."
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap6-1",
          text: "Implementei diversificação inteligente por perfil, ativos e estratégia"
        },
        {
          id: "cap6-2",
          text: "Aplico a regra dos 2% em cada operação"
        },
        {
          id: "cap6-3",
          text: "Configurei Stop Loss diário e drawdown máximo"
        },
        {
          id: "cap6-4",
          text: "Faço rebalanceamento mensal do portfólio"
        },
        {
          id: "cap6-5",
          text: "Uso estratégias de proteção de lucros (Trailing Stop)"
        },
        {
          id: "cap6-6",
          text: "Sigo plano de crescimento sustentável"
        }
      ]
    },
    {
      id: "cap7",
      number: 7,
      title: "Vantagens e Riscos",
      icon: "Scale",
      image: "/images/advantages-benefits.png",
      content: {
        intro: "É fundamental entender tanto as vantagens quanto os riscos do Copy Trading para tomar decisões informadas. Nenhum investimento é perfeito - todos têm prós e contras. O segredo é conhecê-los profundamente.",
        sections: [
          {
            title: "Vantagens do Copy Trading",
            image: "/images/advantages-benefits.png",
            description: "O Copy Trading democratiza o acesso a estratégias profissionais de investimento, oferecendo benefícios significativos especialmente para iniciantes.",
            benefits: [
              {
                name: "🎯 Acessibilidade para Iniciantes",
                description: "Você não precisa ser especialista em análise técnica, gráficos ou indicadores complexos. Basta escolher bem o trader e deixar o sistema trabalhar automaticamente.",
                impact: "Reduz drasticamente a curva de aprendizado de anos para semanas. Você pode começar a investir enquanto aprende, ao invés de esperar anos estudando."
              },
              {
                name: "⏰ Economia de Tempo Massiva",
                description: "Não precisa ficar horas analisando gráficos, acompanhando notícias econômicas ou monitorando o mercado 24/7. O trader faz isso por você.",
                impact: "Ideal para quem tem outras atividades profissionais. Você pode ter uma renda passiva enquanto trabalha, estuda ou cuida da família."
              },
              {
                name: "📚 Aprendizado Prático em Tempo Real",
                description: "Ao observar as operações dos traders, você aprende estratégias reais na prática. É como ter um mentor profissional te ensinando gratuitamente.",
                impact: "Educação financeira enquanto investe. Você vê na prática o que funciona e o que não funciona, sem precisar arriscar sozinho."
              },
              {
                name: "🛡️ Diversificação Facilitada",
                description: "Pode copiar múltiplos traders simultaneamente, diversificando automaticamente entre estratégias, ativos e perfis de risco diferentes.",
                impact: "Redução significativa de risco sem esforço extra. Diversificação que levaria anos para construir manualmente, você consegue em minutos."
              },
              {
                name: "📊 Transparência Total",
                description: "Todo histórico dos traders é público e verificável. Você vê exatamente quantos ganhos, perdas, drawdown e frequência de operações cada trader tem.",
                impact: "Decisões baseadas em dados reais e verificáveis, não em promessas vazias ou marketing enganoso."
              },
              {
                name: "💰 Baixo Capital Inicial",
                description: "Pode começar com apenas R$200-500, diferente de outros investimentos que exigem milhares ou milhões.",
                impact: "Democratização do acesso a estratégias profissionais. Qualquer pessoa pode começar, independente do capital disponível."
              },
              {
                name: "🔄 Flexibilidade Total",
                description: "Pode pausar, ajustar ou encerrar a cópia a qualquer momento. Não há lock-up period ou penalidades por sair.",
                impact: "Controle total sobre seu dinheiro. Você não fica preso a decisões ruins e pode reagir rapidamente a mudanças."
              },
              {
                name: "🌍 Acesso Global",
                description: "Pode copiar traders de qualquer lugar do mundo, aproveitando expertise internacional e diferentes perspectivas de mercado.",
                impact: "Acesso a estratégias que você nunca teria sozinho. Traders asiáticos, europeus, americanos - todos disponíveis."
              },
              {
                name: "🤖 Automação Completa",
                description: "Tudo é automatizado: entrada, saída, gestão de posições. Você não precisa fazer nada manualmente.",
                impact: "Elimina erro humano e emoções. As operações são executadas perfeitamente, sem hesitação ou medo."
              },
              {
                name: "📈 Potencial de Retorno Superior",
                description: "Traders profissionais consistentemente entregam 5-15% ao mês, muito superior a investimentos tradicionais (0,5-1% ao mês).",
                impact: "Seu dinheiro trabalha mais eficientemente. R$1.000 a 10% ao mês vira R$3.138 em 1 ano (vs R$1.127 na poupança)."
              }
            ]
          },
          {
            title: "Riscos do Copy Trading",
            image: "/images/risks-warning.png",
            description: "Todo investimento tem riscos. Conhecê-los profundamente é essencial para se proteger e tomar decisões inteligentes.",
            risks: [
              {
                name: "❌ Nenhum Trader Acerta Sempre",
                description: "Mesmo os melhores traders têm períodos de perda. Não existe garantia de lucro, e resultados passados não garantem resultados futuros.",
                mitigation: "✅ **Solução**: Diversifique entre 3-5 traders diferentes. Use Stop Loss rigoroso. Aceite que perdas fazem parte do processo."
              },
              {
                name: "📉 Risco de Drawdown Significativo",
                description: "Seu capital pode diminuir 20-30% ou mais em períodos de perdas consecutivas, especialmente com traders agressivos.",
                mitigation: "✅ **Solução**: Escolha traders com drawdown histórico baixo (máximo 25%). Configure drawdown máximo de 20% e pare se atingir."
              },
              {
                name: "🎭 Dependência de Terceiros",
                description: "Você depende completamente das decisões do trader. Se ele errar, você erra junto. Se ele mudar de estratégia, você é afetado.",
                mitigation: "✅ **Solução**: Monitore regularmente (semanal). Tenha critérios claros para pausar (ex: 3 semanas negativas consecutivas)."
              },
              {
                name: "🔄 Risco de Mudança de Estratégia",
                description: "O trader pode mudar sua estratégia sem aviso, aumentando risco ou mudando perfil (de conservador para agressivo).",
                mitigation: "✅ **Solução**: Acompanhe as operações semanalmente. Se notar mudanças drásticas (aumento de frequência, alavancagem maior), pause e reavalie."
              },
              {
                name: "🌪️ Risco de Mercado (Eventos Inesperados)",
                description: "Crises econômicas, guerras, pandemias, decisões de bancos centrais podem causar perdas súbitas e imprevisíveis.",
                mitigation: "✅ **Solução**: Use 'Checkout na sexta-feira' para evitar gaps de fim de semana. Nunca invista dinheiro que você precisa para viver."
              },
              {
                name: "😎 Excesso de Confiança",
                description: "Após alguns lucros iniciais, você pode se tornar confiante demais e aumentar riscos, alavancar mais ou ignorar regras de gestão.",
                mitigation: "✅ **Solução**: Mantenha disciplina férrea. Siga SEMPRE as regras de gestão de risco, mesmo quando está ganhando. Arrogância destrói contas."
              },
              {
                name: "💸 Risco de Overtrading",
                description: "Alguns traders operam demais (scalpers), gerando muitas taxas e spreads que corroem seus lucros.",
                mitigation: "✅ **Solução**: Prefira traders com 10-30 operações por mês. Evite scalpers extremos (100+ trades/mês) se você tem capital pequeno."
              },
              {
                name: "🎰 Risco de Alavancagem Excessiva",
                description: "Traders que usam alavancagem muito alta (1:100+) podem ter lucros explosivos, mas também perdas catastróficas.",
                mitigation: "✅ **Solução**: Evite traders com alavancagem acima de 1:50. Prefira 1:10 a 1:30 para segurança."
              },
              {
                name: "👥 Risco de Fraude ou Manipulação",
                description: "Embora raro em plataformas reguladas, existe risco de traders manipularem resultados ou usarem contas demo.",
                mitigation: "✅ **Solução**: Use apenas plataformas reguladas (Exness é regulada). Verifique se o histórico é de conta real. Desconfie de resultados \"perfeitos\"."
              },
              {
                name: "🧠 Risco Psicológico",
                description: "Ver perdas diárias pode causar ansiedade, estresse e decisões emocionais ruins (como pausar no momento errado).",
                mitigation: "✅ **Solução**: Não monitore diariamente se você é ansioso. Verifique apenas semanalmente. Confie no processo de longo prazo."
              }
            ]
          },
          {
            title: "Realidade do Mercado",
            image: "/images/market-reality.png",
            description: "Vamos falar de números reais, não de marketing. A verdade nua e crua sobre Copy Trading e mercado financeiro.",
            statistics: [
              {
                fact: "📊 70-95% dos traders individuais perdem dinheiro",
                context: "Estudos mostram que a vasta maioria das pessoas que tenta fazer trading sozinha perde capital ao longo do tempo. Apenas 5-30% são consistentemente lucrativos.",
                lesson: "✅ Copy Trading aumenta suas chances dramaticamente ao copiar os 5-30% que são lucrativos, ao invés de tentar ser um deles sozinho."
              },
              {
                fact: "⏳ Tempo médio para consistência: 3-6 meses",
                context: "Leva tempo para encontrar os traders certos, ajustar estratégias e entender o mercado. Os primeiros meses são de aprendizado.",
                lesson: "✅ Tenha paciência. Não desista após 2 semanas de perdas. Sucesso no Copy Trading é jogo de longo prazo (6+ meses)."
              },
              {
                fact: "💰 Retorno realista: 5-15% ao mês",
                context: "Traders consistentes e confiáveis geralmente entregam entre 5-15% mensais. Alguns meses mais, outros menos. Média anual: 60-180%.",
                lesson: "✅ Desconfie de promessas de 50%+ ao mês todo mês. É insustentável. Prefira consistência a picos explosivos."
              },
              {
                fact: "📉 Drawdown médio de traders bons: 15-25%",
                context: "Mesmo traders excelentes têm períodos de perda. Drawdown de 15-25% é normal e esperado em algum momento.",
                lesson: "✅ Prepare-se psicologicamente para ver seu capital cair 20% temporariamente. Faz parte do processo."
              },
              {
                fact: "🎯 Taxa de acerto de 40-60% é suficiente",
                context: "Você não precisa acertar 90% das operações. Com gestão de risco 1:2, acertar 40% já é lucrativo.",
                lesson: "✅ Foque em gestão de risco, não em taxa de acerto. Perder 6 e ganhar 4 pode ser lucrativo se os ganhos forem maiores que as perdas."
              },
              {
                fact: "💸 Capital inicial recomendado: R$500-1000",
                context: "Com menos de R$500, as taxas e spreads corroem muito os lucros. Com R$1000+, você tem margem confortável.",
                lesson: "✅ Se você tem menos de R$500, junte mais antes de começar. Ou comece com R$200-300 apenas para aprender, sem expectativa de lucro grande."
              },
              {
                fact: "🔄 60% dos copiadores desistem nos primeiros 3 meses",
                context: "A maioria desiste cedo demais, geralmente após uma sequência de perdas ou por expectativas irreais.",
                lesson: "✅ Seja parte dos 40% que persistem. Quem passa dos 3 meses tem muito mais chance de sucesso a longo prazo."
              },
              {
                fact: "📈 Diversificação reduz risco em 40-60%",
                context: "Estudos mostram que copiar 3-5 traders reduz volatilidade e drawdown em 40-60% comparado a copiar apenas 1.",
                lesson: "✅ NUNCA coloque tudo em um trader. Diversificação não é opcional, é obrigatória."
              }
            ]
          },
          {
            title: "Comparação: Copy Trading vs Outros Investimentos",
            description: "Vamos comparar Copy Trading com outras formas populares de investimento para você ter perspectiva realista.",
            approach: [
              {
                name: "💰 Poupança",
                allocation: "Retorno: ~0,5% ao mês | Risco: Baixíssimo",
                benefit: "Copy Trading: 10-20x mais retorno, mas com risco moderado. Vale a pena para quem aceita volatilidade."
              },
              {
                name: "📊 Ações (Buy & Hold)",
                allocation: "Retorno: ~1-2% ao mês | Risco: Moderado",
                benefit: "Copy Trading: 3-10x mais retorno, mas com maior volatilidade diária. Ações são mais estáveis no longo prazo."
              },
              {
                name: "🏠 Fundos Imobiliários",
                allocation: "Retorno: ~0,8-1,5% ao mês | Risco: Baixo-Moderado",
                benefit: "Copy Trading: 5-15x mais retorno, mas sem renda passiva garantida. FIIs são mais previsíveis."
              },
              {
                name: "💎 Criptomoedas (Buy & Hold)",
                allocation: "Retorno: Variável (-50% a +200%) | Risco: Altíssimo",
                benefit: "Copy Trading: Mais controlado e previsível. Cripto tem potencial maior, mas risco extremo."
              },
              {
                name: "📈 Trading Manual (Sozinho)",
                allocation: "Retorno: Variável (-100% a +50%) | Risco: Altíssimo",
                benefit: "Copy Trading: MUITO mais seguro. 95% dos traders manuais perdem. Copy Trading copia os 5% vencedores."
              }
            ]
          }
        ]
      },
      checklist: [
        {
          id: "cap7-1",
          text: "Entendi todas as 10 vantagens principais do Copy Trading"
        },
        {
          id: "cap7-2",
          text: "Compreendi todos os 10 riscos e suas mitigações"
        },
        {
          id: "cap7-3",
          text: "Tenho expectativas realistas: 5-15% ao mês é excelente"
        },
        {
          id: "cap7-4",
          text: "Sei que drawdown de 15-25% é normal e esperado"
        },
        {
          id: "cap7-5",
          text: "Entendi que consistência > picos explosivos"
        },
        {
          id: "cap7-6",
          text: "Estou preparado psicologicamente para volatilidade"
        }
      ]
    },
    {
      id: "cap8",
      number: 8,
      title: "Conclusão e Próximos Passos",
      icon: "CheckCircle",
      image: "/images/final-message.png",
      content: {
        intro: "Parabéns por chegar até aqui! Você agora tem todo o conhecimento necessário para começar no Copy Trading com segurança e confiança. Este não é o fim, mas o **início da sua jornada**.",
        sections: [
          {
            title: "Resumo do Aprendizado",
            image: "/images/learning-summary.png",
            description: "Vamos recapitular tudo que você aprendeu neste ebook completo:",
            summary: [
              "**Copy Trading** é replicar automaticamente operações de traders experientes, mantendo controle total do seu capital",
              "**Conceitos essenciais**: Alavancagem (multiplicador de capital), Drawdown (maior queda), Stop Loss (proteção automática), Take Profit (garantia de lucro)",
              "**Estratégias de perfil**: Conservador (5-8% ao mês, drawdown 10-15%), Moderado (8-15%, drawdown 15-25%), Agressivo (15-30%, drawdown 25-40%)",
              "**Plataforma Exness**: Marketplace transparente, configuração simples, monitoramento em tempo real, controle total",
              "**Seleção de traders**: Histórico 6+ meses, drawdown <25%, consistência > picos, 100+ copiadores, frequência adequada",
              "**Gestão de risco profissional**: Regra dos 2%, drawdown máximo 20%, diversificação 30%, lucro garantido, Stop Loss diário",
              "**Diversificação inteligente**: Por perfil de risco, ativos, estratégia, horário e geografia",
              "**Ferramentas da Exness**: Stop Loss automático, Checkout na sexta, monitoramento em tempo real, múltiplas cópias simultâneas",
              "**Realidade do mercado**: 5-15% ao mês é excelente, drawdown 15-25% é normal, 3-6 meses para consistência",
              "**Disciplina e paciência** são mais importantes que sorte ou timing perfeito"
            ]
          },
          {
            title: "Próximos Passos Práticos",
            image: "/images/next-steps.png",
            description: "Agora é hora de colocar em prática! Siga este roteiro passo a passo para começar sua jornada no Copy Trading:",
            steps_detailed: [
              {
                step: "1️⃣ Crie sua conta na Exness",
                action: "Acesse o site oficial da Exness (exness.com), clique em 'Abrir Conta', preencha seus dados e confirme o email",
                time: "⏱️ 15 minutos"
              },
              {
                step: "2️⃣ Valide sua identidade (KYC)",
                action: "Envie documento de identidade (RG/CNH), comprovante de residência e selfie. Aguarde aprovação (geralmente 24-48h)",
                time: "⏱️ 10 minutos + 24-48h de espera"
              },
              {
                step: "3️⃣ Faça seu primeiro depósito",
                action: "Deposite R$200-500 via PIX (instantâneo). Comece pequeno para aprender sem pressão",
                time: "⏱️ 5 minutos (instantâneo)"
              },
              {
                step: "4️⃣ Explore o Marketplace de Traders",
                action: "Analise pelo menos 10 traders usando os critérios aprendidos: histórico 6+ meses, drawdown <25%, consistência, 100+ copiadores",
                time: "⏱️ 1-2 horas (faça com calma)"
              },
              {
                step: "5️⃣ Escolha seus primeiros 2-3 traders",
                action: "Selecione 1 conservador + 1 moderado (ou 2 conservadores se você é muito cauteloso). Diversifique desde o início",
                time: "⏱️ 30 minutos"
              },
              {
                step: "6️⃣ Configure sua primeira cópia",
                action: "Invista 30-40% do capital no primeiro trader. Configure Stop Loss 15%, Take Profit 30%, ative 'Checkout na sexta'",
                time: "⏱️ 10 minutos"
              },
              {
                step: "7️⃣ Configure a segunda cópia",
                action: "Invista mais 30-40% no segundo trader. Mantenha 20-30% de reserva para oportunidades futuras",
                time: "⏱️ 10 minutos"
              },
              {
                step: "8️⃣ Configure alertas e monitoramento",
                action: "Ative notificações por email/app. Crie lembretes semanais para revisar performance",
                time: "⏱️ 5 minutos"
              },
              {
                step: "9️⃣ Monitore e ajuste semanalmente",
                action: "Toda sexta-feira, dedique 30 minutos para revisar: lucro/perda semanal, operações abertas, performance dos traders",
                time: "⏱️ 30 minutos por semana"
              },
              {
                step: "🔟 Faça rebalanceamento mensal",
                action: "No último dia do mês, analise performance completa. Pause traders ruins, mantenha bons, busque novos se necessário",
                time: "⏱️ 1-2 horas por mês"
              }
            ]
          },
          {
            title: "Mentalidade para o Sucesso",
            image: "/images/success-mindset.png",
            description: "Sua mentalidade determinará seu sucesso mais do que qualquer estratégia. Traders bem-sucedidos pensam diferente.",
            mindset: [
              {
                principle: "🧘 Paciência é Poder",
                description: "Copy Trading não é loteria ou esquema de enriquecimento rápido. Resultados consistentes levam tempo (3-6 meses mínimo). Os primeiros meses são de aprendizado e ajuste.",
                action: "✅ **Ação**: Não desista após 1-2 semanas de perdas. Comprometa-se com pelo menos 6 meses antes de julgar se funciona para você."
              },
              {
                principle: "📏 Disciplina é Não-Negociável",
                description: "Siga SEMPRE as regras de gestão de risco, mesmo quando tentado a arriscar mais após ganhos ou recuperar perdas rapidamente. Disciplina separa amadores de profissionais.",
                action: "✅ **Ação**: Crie um checklist físico e consulte antes de cada decisão. Nunca quebre regras por emoção."
              },
              {
                principle: "📚 Aprendizado Contínuo",
                description: "O mercado muda constantemente. Estratégias que funcionam hoje podem não funcionar amanhã. Continue aprendendo, testando e ajustando.",
                action: "✅ **Ação**: Dedique 30 minutos semanais para ler sobre mercado financeiro, assistir análises ou estudar novos traders."
              },
              {
                principle: "🎯 Realismo > Otimismo",
                description: "Tenha expectativas realistas. 5-15% ao mês é excelente (60-180% ao ano). Não compare com promessas irreais de 50%+ ao mês.",
                action: "✅ **Ação**: Desconfie de qualquer promessa de ganho garantido ou retornos \"milagrosos\". Se parece bom demais, provavelmente é."
              },
              {
                principle: "🧊 Controle Emocional",
                description: "Não deixe emoções (ganância, medo, euforia, desespero) guiarem suas decisões. Tome decisões baseadas em dados e lógica, não em sentimentos.",
                action: "✅ **Ação**: Quando sentir emoção forte (querer aumentar muito após ganhos ou pausar tudo após perdas), espere 24h antes de agir."
              },
              {
                principle: "🔬 Mentalidade de Cientista",
                description: "Trate Copy Trading como experimento. Teste hipóteses, colete dados, analise resultados, ajuste estratégia. Não se apegue emocionalmente a traders.",
                action: "✅ **Ação**: Mantenha planilha detalhada de todas operações. Analise mensalmente: o que funcionou? O que não funcionou? Por quê?"
              },
              {
                principle: "💪 Resiliência Mental",
                description: "Você terá semanas ruins. Drawdowns acontecem. Traders falham. Isso é normal. Resiliência é continuar seguindo o plano mesmo quando está difícil.",
                action: "✅ **Ação**: Quando tiver semana ruim, releia este ebook. Lembre-se que drawdown de 15-25% é esperado e recuperável."
              },
              {
                principle: "🎓 Humildade Intelectual",
                description: "Você não sabe tudo. O mercado sempre pode te surpreender. Mantenha humildade e disposição para admitir erros e aprender com eles.",
                action: "✅ **Ação**: Quando errar (escolher trader ruim, quebrar regra), anote o erro e a lição aprendida. Não repita."
              }
            ]
          },
          {
            title: "Recursos Adicionais na Área VIP",
            image: "/images/resources-tools.png",
            description: "Como membro VIP, você tem acesso a ferramentas exclusivas para maximizar seus resultados:",
            resources: [
              "📊 **Planilha de Acompanhamento de Trades**: Registre todas operações, calcule lucro/perda, analise performance por trader",
              "🧮 **Calculadora de Risco Avançada**: Calcule tamanho ideal de posição, Stop Loss, Take Profit, proporção risco/recompensa",
              "📈 **Dashboard de Performance**: Visualize graficamente seu progresso, compare traders, identifique padrões",
              "📋 **Checklist de Análise de Traders**: Lista completa de critérios para avaliar traders antes de copiar",
              "💬 **Comunidade VIP no Telegram**: Troque experiências, tire dúvidas, compartilhe traders recomendados com outros membros",
              "📧 **Suporte Especializado**: Equipe dedicada para responder dúvidas técnicas e estratégicas",
              "📰 **Relatórios Mensais**: Análise de mercado, traders em destaque, oportunidades identificadas",
              "🎓 **Webinars Exclusivos**: Aulas ao vivo sobre estratégias avançadas, gestão de risco, psicologia de investimento"
            ]
          },
          {
            title: "Cronograma Sugerido - Primeiros 90 Dias",
            description: "Siga este cronograma para ter um início estruturado e progressivo:",
            steps_detailed: [
              {
                step: "Semana 1-2: Preparação e Estudo",
                action: "Criar conta, validar identidade, estudar marketplace, selecionar 5-10 traders candidatos, fazer primeiro depósito (R$200-500)",
                time: "Foco: Aprender sem pressão"
              },
              {
                step: "Semana 3-4: Primeira Cópia",
                action: "Escolher 1 trader conservador, investir 30% do capital, configurar Stop Loss 15%, monitorar diariamente para aprender",
                time: "Foco: Ganhar experiência prática"
              },
              {
                step: "Semana 5-8: Diversificação",
                action: "Adicionar 2º trader (moderado), investir mais 30-40%, manter 20-30% de reserva, monitorar semanalmente",
                time: "Foco: Construir portfólio diversificado"
              },
              {
                step: "Semana 9-12: Otimização",
                action: "Avaliar performance dos 2 traders, fazer primeiro rebalanceamento, considerar 3º trader se necessário",
                time: "Foco: Ajustar estratégia baseado em resultados"
              },
              {
                step: "Mês 4-6: Consolidação",
                action: "Manter estratégia que funcionou, fazer rebalanceamento mensal, começar a retirar lucros (50% dos ganhos)",
                time: "Foco: Consistência e proteção de lucros"
              },
              {
                step: "Mês 7+: Crescimento",
                action: "Considerar aumentar capital gradualmente (máximo +50% por vez), explorar estratégias avançadas, mentorear outros iniciantes",
                time: "Foco: Escalar resultados sustentavelmente"
              }
            ]
          },
          {
            title: "Mensagem Final do Autor",
            image: "/images/final-message.png",
            message: "Você chegou ao fim deste ebook, mas está apenas no **início da sua jornada** no Copy Trading.\n\nEste guia te deu todo o conhecimento técnico necessário: conceitos, estratégias, gestão de risco, análise de traders. Mas o sucesso depende de três coisas que só você pode fornecer:\n\n1. **Disciplina** para seguir as regras mesmo quando é difícil\n2. **Paciência** para esperar resultados sem desistir cedo\n3. **Consistência** para continuar aprendendo e ajustando\n\nO Copy Trading da Exness é uma ferramenta poderosa que democratiza acesso a estratégias profissionais. Mas como qualquer ferramenta, os resultados dependem de como você a usa.\n\n**Não espere ficar rico da noite para o dia.** Espere construir renda extra consistente ao longo de meses e anos.\n\n**Não espere nunca perder.** Espere ter drawdowns, mas recuperá-los com disciplina.\n\n**Não espere que seja fácil.** Espere que seja simples, mas exija comprometimento.\n\nComece pequeno (R$200-500). Aprenda com erros. Ajuste estratégias. Seja paciente. E acima de tudo, **nunca invista dinheiro que você precisa para viver**.\n\nSe você seguir tudo que aprendeu neste ebook, suas chances de sucesso são muito maiores que a média. Você está nos 10% que realmente estudam antes de investir.\n\nAgora é sua vez de agir. Boa sorte, e nos vemos na comunidade VIP! 🚀\n\n**— Equipe Cripto Primos**"
          }
        ]
      },
      checklist: [
        {
          id: "cap8-1",
          text: "Revisei todos os conceitos essenciais do ebook"
        },
        {
          id: "cap8-2",
          text: "Tenho um plano de ação claro para os próximos 90 dias"
        },
        {
          id: "cap8-3",
          text: "Entendi a importância da mentalidade correta (paciência, disciplina, realismo)"
        },
        {
          id: "cap8-4",
          text: "Conheço todos os recursos adicionais disponíveis na Área VIP"
        },
        {
          id: "cap8-5",
          text: "Estou pronto para começar com capital seguro (R$200-500)"
        },
        {
          id: "cap8-6",
          text: "Comprometo-me a seguir as regras de gestão de risco religiosamente"
        },
        {
          id: "cap8-7",
          text: "Entendi que sucesso leva 3-6 meses, não 1-2 semanas"
        },
        {
          id: "cap8-8",
          text: "Estou preparado para começar minha jornada no Copy Trading!"
        }
      ]
    }
  ]
};

export default ebookData;

