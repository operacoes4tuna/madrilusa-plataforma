# 📊 SinergIA Madrilusa V2 - Explicação Completa

## 🎯 **Objetivo**
Sistema de matching inteligente entre **Empresas** e **Imigrantes** usando análise híbrida (estruturada + IA) para encontrar compatibilidades de emprego.

---

## 🔄 **Fluxo de Funcionamento**

### **1. Interface (Frontend)**
**Arquivo:** `src/app/pages/SinergiaV2.tsx`

#### **Para Empresas:**
1. Empresa acessa `/app/sinergia-v2`
2. Seleciona uma **oportunidade de trabalho** cadastrada
3. Clica em "Analisar Compatibilidades"
4. Sistema busca imigrantes compatíveis

#### **Para Imigrantes:**
1. Imigrante acessa `/app/sinergia-v2`
2. Clica em "Analisar Minhas Oportunidades"
3. Sistema busca oportunidades compatíveis

---

## 🧠 **Lógica de Matching (Backend)**
**Arquivo:** `backend/src/modules/sinergia/sinergia-v2.service.ts`

### **Processo em 5 Etapas:**

#### **ETAPA 1: Coleta de Dados Completos**
```typescript
// Para Oportunidade
- Dados da vaga (título, descrição, requisitos)
- Localização (município)
- Requisitos técnicos (experiências, formação, idiomas)
- Requisitos pessoais (idade, gênero, transporte, fluência)
- Habilidades desejadas
- Características de personalidade

// Para Imigrante
- Perfil pessoal (idade, gênero, município)
- Dados profissionais (experiências, formação, idiomas)
- Contribuições (Habilidades, Interesse, Personalidade)
- Objetivos e disponibilidades
```

#### **ETAPA 2: Pré-Filtro (Critérios Eliminatórios)**
```typescript
preFilterCandidates(oportunidade, imigrantes)
```

**Elimina automaticamente candidatos que:**
- Não atendem gênero obrigatório
- Não tem transporte próprio (quando obrigatório)
- Não tem fluência em português (quando obrigatório)
- Idade incompatível com faixa etária da vaga

**Resultado:** Lista reduzida de candidatos viáveis

---

#### **ETAPA 3: Análise Estruturada (10 Critérios)**
```typescript
calculateStructuredScore(oportunidade, imigrante, config)
```

**10 critérios analisados automaticamente:**

| # | Critério | Peso Padrão | Cálculo |
|---|----------|-------------|---------|
| 1 | **Gênero** | 5% | Match exato ou "Indiferente" |
| 2 | **Idade** | 10% | Compatibilidade com faixa etária |
| 3 | **Município** | 15% | Mesmo município = 100, diferente = 50 |
| 4 | **Transporte Próprio** | 10% | Obrigatório = 100/0, Opcional = 75 |
| 5 | **Fluência Português** | 10% | Níveis aceitos: Avançada/Fluente |
| 6 | **Experiências** | 15% | Match entre experiências da vaga e do imigrante |
| 7 | **Formação** | 15% | Nível escolaridade + áreas de formação |
| 8 | **Idiomas** | 5% | Idiomas requeridos vs conhecidos |
| 9 | **Habilidades** | 10% | Tags de habilidades coincidentes |
| 10 | **Características** | 5% | Tags de personalidade/interesse |

**Cada critério gera:**
- `match`: boolean (compatível ou não)
- `score`: 0-100 (quão compatível)
- `details`: string (explicação textual)

**Score Estruturado Final:** Média ponderada dos 10 critérios

---

#### **ETAPA 4: Análise Semântica com IA (GPT-4)**
```typescript
analyzeSemanticMatch(oportunidade, imigrante, structuredScore, iaConfig)
```

**Quando usa IA:**
- `useAI: true` na requisição
- Score estruturado >= `thresholdMinimo` (padrão: 40%)
- Tokens disponíveis no orçamento

**Prompt enviado para GPT-4:**
```
Analise a compatibilidade entre:

OPORTUNIDADE:
- Descrição: [descrição da vaga]
- Requisitos: [requisitos técnicos]
- Perfil desejado: [habilidades + características]

CANDIDATO:
- Experiências: [lista de experiências]
- Formações: [lista de formações]
- Habilidades: [tags de habilidades]
- Interesses: [tags de interesse]
- Personalidade: [tags de personalidade]
- Contribuições: [textos das contribuições]

SCORE ESTRUTURADO: [score dos 10 critérios]

Retorne JSON:
{
  "compatibilidadeProfissional": 0-100,
  "compatibilidadePessoal": 0-100,
  "potencialDesenvolvimento": 0-100,
  "pontosFortesMatch": ["ponto1", "ponto2", ...],
  "areasDesenvolvimento": ["area1", "area2", ...],
  "recomendacao": "texto explicativo",
  "confianca": 0-100
}
```

**IA Analisa:**
- Compatibilidade profissional (experiência + formação)
- Compatibilidade pessoal (soft skills + personalidade)
- Potencial de desenvolvimento (curva de aprendizado)
- Pontos fortes do candidato para essa vaga
- Áreas que precisam desenvolvimento
- Recomendação final e nível de confiança

**Score Semântico:** Média de `compatibilidadeProfissional + compatibilidadePessoal + potencialDesenvolvimento`

---

#### **ETAPA 5: Score Final (Híbrido)**
```typescript
scoreTotal = (scoreEstruturado * pesoEstruturado) + (scoreSemantico * pesoIA)
```

**Configuração Padrão:**
- `pesoEstruturado`: 60% (peso dos 10 critérios objetivos)
- `pesoIA`: 40% (peso da análise semântica do GPT-4)

**Exemplo:**
```
Score Estruturado: 75
Score Semântico: 85

Score Total = (75 * 0.6) + (85 * 0.4)
            = 45 + 34
            = 79
```

---

## 📊 **Resultado Final**

Cada match retorna:

```typescript
{
  id: string,
  oportunidadeId: string,
  imigranteId: string,

  // SCORES
  scoreTotal: 79,              // Score final híbrido (0-100)
  scoreEstruturado: 75,        // Score dos 10 critérios (0-100)
  scoreSemantico: 85,          // Score da IA (0-100)

  // DETALHAMENTO
  criterios: {
    genero: { match: true, score: 100, details: "..." },
    idade: { match: true, score: 100, details: "..." },
    // ... 10 critérios
  },

  analiseIA: {
    compatibilidadeProfissional: 90,
    compatibilidadePessoal: 85,
    potencialDesenvolvimento: 80,
    pontosFortesMatch: ["Experiência relevante", "Soft skills"],
    areasDesenvolvimento: ["Português avançado"],
    recomendacao: "Candidato altamente compatível...",
    confianca: 95
  },

  // DADOS DO CANDIDATO
  imigrante: {
    nome: "João Silva",
    email: "joao@email.com",
    foto: "...",
    perfil: { ... }
  },

  // METADADOS
  tokensUsed: 1500,           // Tokens gastos na análise IA
  aiModel: "gpt-4-turbo",     // Modelo usado
  processingTime: 2500,       // Tempo de processamento (ms)
  createdAt: "2025-01-10T..."
}
```

---

## 🎛️ **Configuração Parametrizável**

**Página Admin:** `/app/sinergia-config-admin`

### **Parâmetros Ajustáveis:**

#### **1. Pesos dos Critérios (0-100%)**
```typescript
{
  genero: 5,
  idade: 10,
  municipio: 15,
  transporteProprio: 10,
  fluenciaPortugues: 10,
  experiencias: 15,
  formacao: 15,
  idiomas: 5,
  habilidades: 10,
  caracteristicas: 5
}
```

#### **2. Configuração de IA**
```typescript
{
  modelo: "gpt-4-turbo",           // Modelo OpenAI
  temperatura: 0.3,                 // Criatividade (0-1)
  maxTokens: 2000,                  // Limite de tokens por análise
  thresholdMinimo: 40,              // Score mínimo para usar IA
  pesoIA: 40,                       // Peso da IA no score final (%)
  custoMaximoPorAnalise: 0.10       // Custo máximo por análise ($)
}
```

#### **3. Critérios Eliminatórios**
```typescript
{
  generoObrigatorio: true,          // Eliminar se gênero incompatível
  transporteObrigatorio: true,      // Eliminar se sem transporte
  fluenciaObrigatoria: true,        // Eliminar se fluência insuficiente
  idadeEstrita: false               // Eliminar se idade fora da faixa
}
```

---

## 📈 **Métricas e Analytics**

### **Métricas de Custo**
- Total gasto em análises IA ($)
- Média de tokens por análise
- Análises com/sem IA
- Custo por match

### **Métricas de Performance**
- Tempo médio de análise
- Taxa de uso de IA (%)
- Distribuição de scores
- Matches por faixa de compatibilidade

---

## 🔍 **Filtros Disponíveis**

**Interface permite filtrar resultados por:**
- Score mínimo/máximo
- Apenas matches com IA
- Apenas high scores (>70%)
- Ordenação (score, data, tokens)

---

## 💡 **Casos de Uso**

### **Caso 1: Empresa buscando desenvolvedor**
1. Empresa cria oportunidade: "Desenvolvedor Web Junior"
2. Sistema analisa 50 imigrantes
3. Pré-filtro: 30 candidatos viáveis
4. Análise estruturada: scores 45-85
5. IA analisa os 20 com score > 40
6. Resultado: Top 10 matches ordenados por compatibilidade

### **Caso 2: Imigrante buscando oportunidades**
1. Imigrante preenche perfil completo
2. Sistema analisa 100 vagas disponíveis
3. Matching reverso: vagas × perfil do imigrante
4. Resultado: Top 20 oportunidades compatíveis

---

## 🚀 **Diferenciais da V2**

1. **Híbrido:** Combina regras objetivas + análise semântica IA
2. **Parametrizável:** Admin pode ajustar pesos e critérios
3. **Escalável:** Pré-filtro reduz uso de IA
4. **Transparente:** Breakdown completo de cada critério
5. **Controlável:** Orçamento de tokens e custo máximo
6. **Auditável:** Logs de todas as análises e métricas

---

## 📚 **Arquivos Relacionados**

### **Frontend**
- `src/app/pages/SinergiaV2.tsx` - Interface principal
- `src/app/components/sinergia-v2/MatchCard.tsx` - Card de resultado
- `src/app/components/sinergia-v2/CompatibilityBreakdown.tsx` - Detalhamento
- `src/hooks/useSinergiaV2.ts` - Hook de integração

### **Backend**
- `backend/src/modules/sinergia/sinergia-v2.service.ts` - Lógica principal
- `backend/src/modules/sinergia/sinergia-v2.types.ts` - Tipos TypeScript
- `backend/src/modules/sinergia/configuracao-sinergia.service.ts` - Configuração
- `backend/src/modules/sinergia/sinergia-v2-analytics.service.ts` - Métricas

---

**📞 Para dúvidas ou ajustes, consultar a equipe de desenvolvimento.**

*Última atualização: Janeiro 2025*
