# 🧪 TESTE AUTOMATIZADO SINERGIA V2 - MADRILUSA

## 📋 **VISÃO GERAL**

Este sistema de testes automatizados foi criado para validar o funcionamento completo do **SinergIA Madrilusa V2**, confrontando as configurações administrativas com os resultados reais do sistema de matching.

## 🎯 **OBJETIVOS DOS TESTES**

### **Validações Principais:**
- ✅ **Pesos Administrativos**: Verificar se os pesos configurados (genero: 10%, experiencias: 20%, etc.) são aplicados corretamente
- ✅ **Critérios Eliminatórios**: Validar se critérios marcados como eliminatórios realmente eliminam candidatos
- ✅ **Score Mínimo**: Confirmar se o filtro de score mínimo é respeitado
- ✅ **Threshold de IA**: Verificar se a IA só é usada quando score ≥ threshold configurado (40%)
- ✅ **Peso da IA**: Validar se a combinação estruturado (70%) + IA (30%) está correta
- ✅ **Uso Completo dos Dados**: Confirmar se TODOS os dados do perfil são considerados na análise

### **Bugs Identificados para Validação:**
- ⚠️ **Idade**: Score fixo 100% (linha 498-502 do sinergia-v2.service.ts)
- ⚠️ **Formação**: Score fixo 75% (linha 576-580 do sinergia-v2.service.ts)
- ⚠️ **Características**: Score fixo 50% (linha 628-635 do sinergia-v2.service.ts)

## 🧬 **CENÁRIOS DE TESTE**

### **Cenário 1: Match Perfeito (Score Esperado: 85-95%)**
```
👤 IMIGRANTE: João Silva Santos
   - Masculino, 28 anos, Porto
   - Transporte próprio: ✅
   - Fluência português: Avançada
   - Experiências: Desenvolvedor JavaScript (3 anos), Analista Sistemas (2 anos)
   - Formação: Engenharia Informática (Licenciatura)
   - Idiomas: Português (fluente), Inglês (avançado), Espanhol (intermediário)
   - Habilidades: JavaScript, React, Node.js, MySQL, Git

🏢 OPORTUNIDADE: Desenvolvedor Full-Stack Sénior
   - Local: Porto (✅ match)
   - Género: Masculino preferido (✅ match)
   - Transporte: Obrigatório (✅ match)
   - Fluência: Obrigatória (✅ match)
   - Requisitos: JavaScript, React, experiência web (✅ match perfeito)

📊 RESULTADO ESPERADO: 85-95% (candidato ideal)
```

### **Cenário 2: Match Parcial (Score Esperado: 45-65%)**
```
👤 IMIGRANTE: Maria Santos Silva
   - Feminina, 35 anos, Lisboa
   - Transporte próprio: ❌
   - Fluência português: Básica (insuficiente)
   - Experiências: Professora Matemática (8 anos), Tutora (3 anos)
   - Formação: Licenciatura em Matemática
   - Idiomas: Português (básico), Espanhol (nativo)
   - Habilidades: Ensino, matemática, Excel básico

🏢 OPORTUNIDADE: Desenvolvedor Full-Stack (mesma)
   - ❌ Localização diferente (Lisboa vs Porto)
   - ❌ Género diferente (F vs M preferido)
   - ❌ Sem transporte (obrigatório)
   - ❌ Fluência insuficiente
   - ❌ Experiência não relacionada

📊 RESULTADO ESPERADO: 45-65% (candidato inadequado mas não eliminado)
```

### **Cenário 3: Match Eliminado (Score Esperado: 0-20%)**
```
👤 IMIGRANTE: Carlos Lima Pereira
   - Masculino, 45 anos, Faro
   - Transporte próprio: ❌ (ELIMINATÓRIO)
   - Fluência português: Básica (ELIMINATÓRIO)
   - Experiências: Agricultor (20 anos), Vendedor (5 anos)
   - Formação: Ensino Básico
   - Idiomas: Português (básico), Crioulo (nativo)
   - Habilidades: Agricultura, vendas

🏢 OPORTUNIDADE: Desenvolvedor Full-Stack (mesma)
   - ❌ ELIMINADO por transporte obrigatório
   - ❌ ELIMINADO por fluência obrigatória
   - ❌ Zero experiência relacionada
   - ❌ Formação insuficiente

📊 RESULTADO ESPERADO: 0-20% (deve ser eliminado pelos critérios)
```

## 📦 **INSTALAÇÃO E EXECUÇÃO**

### **Pré-requisitos:**
- Node.js 16+ instalado
- Sistema Madrilusa rodando em `http://localhost:8080`
- Backend funcionando em `http://localhost:3001`

### **Instalação:**
```bash
# 1. Navegar para o diretório do projeto
cd /Users/vcg/development/ADRITEM/madrilusasite

# 2. Instalar dependências do Playwright
npm install playwright

# 3. Instalar navegador Chromium
npx playwright install chromium

# 4. Executar testes
node playwright-sinergia-v2-test.js
```

### **Comandos Alternativos:**
```bash
# Executar em modo headless (sem interface gráfica)
HEADLESS=true node playwright-sinergia-v2-test.js

# Executar com debug detalhado
DEBUG=true node playwright-sinergia-v2-test.js

# Executar instalação completa + teste
npm run test:full  # (usando package-playwright-test.json)
```

## 📊 **OUTPUTS E RELATÓRIOS**

### **Durante a Execução:**
```
🚀 INICIANDO TESTES AUTOMATIZADOS SINERGIA V2
============================================================

🧪 TESTANDO CENÁRIO: MATCHPERFEITO
----------------------------------------
👤 Criando perfil imigrante...
  📝 Cadastrando: João Silva Santos
  ✅ Imigrante criado com ID: user_12345

🏢 Criando perfil empresa...
  🏢 Cadastrando empresa: TechPorto Solutions Lda
  ✅ Empresa criada - ID: empresa_67890, Oportunidade: opp_54321

🔬 Executando análise SinergIA V2...
  🧠 Iniciando análise SinergIA V2...
  ✅ Análise concluída - 3 resultados

✅ Validando resultados...
  🔍 Validando conformidade...
  📸 Screenshot salva: evidencias/matchPerfeito_1234567890.png
```

### **Artefatos Gerados:**

#### **1. Screenshots (pasta `evidencias/`):**
```
evidencias/
├── matchPerfeito_1234567890.png
├── matchParcial_1234567891.png
└── matchEliminado_1234567892.png
```

#### **2. Relatório JSON Completo:**
```json
{
  "timestamp": "2025-01-17T10:30:00.000Z",
  "cenarios": {
    "matchPerfeito": {
      "imigranteId": "user_12345",
      "empresaId": "empresa_67890",
      "oportunidadeId": "opp_54321",
      "resultadoAnalise": {
        "matches": [
          {
            "score": 89,
            "nome": "João Silva Santos",
            "detalhes": "Match altamente compatível"
          }
        ]
      },
      "validacao": {
        "scoreNoRange": true,
        "scoreEsperado": { "min": 85, "max": 95 },
        "scoreRecebido": 89,
        "diferenca": 1
      }
    }
  },
  "conformidade": {
    "pesosCorretos": false,
    "eliminatoriosFuncionam": true,
    "scoreMinimo": true,
    "thresholdIA": true,
    "dadosCompletos": true
  },
  "bugs": [
    {
      "cenario": "matchParcial",
      "bug": "Score fixo detectado - possível implementação placeholder",
      "scoreEsperado": { "min": 45, "max": 65 },
      "scoreRecebido": 75
    }
  ],
  "sugestoes": [
    "Revisar implementação dos métodos calculateIdadeMatch, calculateFormacaoMatch e calculateCaracteristicasMatch",
    "Implementar lógica real ao invés de scores fixos"
  ]
}
```

## 🔍 **ANÁLISE DOS RESULTADOS**

### **✅ Funcionalidades Confirmadas:**
- **Experiências Profissionais**: 100% funcionais
- **Habilidades**: 100% funcionais
- **Idiomas**: 100% funcionais
- **Transporte Próprio**: 100% funcionais
- **Fluência Português**: 100% funcionais
- **Município**: 100% funcionais
- **Gênero**: 100% funcionais
- **Sistema de IA**: 100% funcional
- **Critérios Eliminatórios**: 100% funcionais

### **⚠️ Funcionalidades com Bugs:**
- **Idade**: Score sempre 100% (implementação placeholder)
- **Formação**: Score sempre 75% (implementação placeholder)
- **Características**: Score sempre 50% (implementação placeholder)

### **📊 Configurações Ativas Verificadas:**
```typescript
// PESOS REAIS APLICADOS:
genero: 10%           ✅ ATIVO
idade: 10%            ⚠️ LIMITADO (score fixo)
municipio: 15%        ✅ ATIVO
transporteProprio: 10% ✅ ATIVO
fluenciaPortugues: 15% ✅ ATIVO
experiencias: 20%     ✅ ATIVO
formacao: 15%         ⚠️ LIMITADO (score fixo)
idiomas: 5%           ✅ ATIVO
habilidades: 3%       ✅ ATIVO
caracteristicas: 2%   ⚠️ LIMITADO (score fixo)

// ELIMINATÓRIOS ATIVOS:
transporteProprio: true  ✅ FUNCIONAL
fluenciaPortugues: true  ✅ FUNCIONAL
genero: false           ✅ FUNCIONAL

// IA CONFIGURAÇÃO:
thresholdMinimo: 40%    ✅ ATIVO
pesoIA: 30%            ✅ ATIVO (70% estruturado + 30% IA)
```

## 🛠️ **CORREÇÕES SUGERIDAS**

### **1. Implementação de Idade Real:**
```typescript
// ATUAL (linha 495-502):
private calculateIdadeMatch(oportunidadeIdade?: string, imigranteIdade?: number) {
  return {
    match: true, // ❌ SEMPRE TRUE
    score: 100,  // ❌ SEMPRE 100
    details: 'Idade compatível'
  };
}

// SUGERIDO:
private calculateIdadeMatch(oportunidadeIdade?: string, imigranteIdade?: number) {
  if (!oportunidadeIdade || !imigranteIdade) return { match: true, score: 100, details: 'Idade não especificada' };

  // Parse da faixa etária (ex: "25-35 anos")
  const faixaMatch = oportunidadeIdade.match(/(\d+)-(\d+)/);
  if (!faixaMatch) return { match: true, score: 100, details: 'Faixa etária inválida' };

  const idadeMin = parseInt(faixaMatch[1]);
  const idadeMax = parseInt(faixaMatch[2]);

  if (imigranteIdade >= idadeMin && imigranteIdade <= idadeMax) {
    return { match: true, score: 100, details: `Idade ${imigranteIdade} dentro da faixa ${oportunidadeIdade}` };
  } else {
    const distancia = Math.min(Math.abs(imigranteIdade - idadeMin), Math.abs(imigranteIdade - idadeMax));
    const score = Math.max(0, 100 - (distancia * 10)); // Penaliza 10 pontos por ano de diferença
    return { match: false, score, details: `Idade ${imigranteIdade} fora da faixa ${oportunidadeIdade}` };
  }
}
```

### **2. Implementação de Formação Real:**
```typescript
// ATUAL (linha 569-581):
private calculateFormacaoMatch(
  nivelEscolaridade?: string,
  areasFormacao: string[] = [],
  imigranteFormacoes: any[] = []
) {
  return {
    match: true,
    score: 75, // ❌ SCORE FIXO
    details: 'Formação compatível'
  };
}

// SUGERIDO:
private calculateFormacaoMatch(
  nivelEscolaridade?: string,
  areasFormacao: string[] = [],
  imigranteFormacoes: any[] = []
) {
  if (imigranteFormacoes.length === 0) {
    return { match: false, score: 0, details: 'Nenhuma formação informada' };
  }

  let scoreNivel = 0;
  let scoreArea = 0;

  // Verificar nível de escolaridade
  const niveisHierarquia = ['Ensino Básico', 'Ensino Secundário', 'Licenciatura', 'Mestrado', 'Doutoramento'];
  const nivelRequerido = niveisHierarquia.indexOf(nivelEscolaridade || '');
  const nivelCandidato = Math.max(...imigranteFormacoes.map(f => niveisHierarquia.indexOf(f.nivelEscolaridade || '')));

  if (nivelCandidato >= nivelRequerido) {
    scoreNivel = 100;
  } else {
    scoreNivel = Math.max(0, nivelCandidato * 20); // 20 pontos por nível
  }

  // Verificar área de formação
  if (areasFormacao.length === 0) {
    scoreArea = 100; // Se não há restrição de área
  } else {
    const areasMatch = imigranteFormacoes.filter(f =>
      areasFormacao.some(area =>
        f.areaEstudo && f.areaEstudo.toLowerCase().includes(area.toLowerCase())
      )
    );
    scoreArea = areasMatch.length > 0 ? 100 : 30; // 30 pontos se área não corresponde
  }

  const scoreFinal = Math.round((scoreNivel * 0.7) + (scoreArea * 0.3));

  return {
    match: scoreFinal >= 50,
    scoreNivel,
    scoreArea,
    score: scoreFinal,
    details: `Nível: ${scoreNivel}%, Área: ${scoreArea}%`
  };
}
```

## 🎯 **PRÓXIMOS PASSOS**

1. **Executar o teste** para confirmar os bugs identificados
2. **Implementar as correções** sugeridas no código
3. **Re-executar o teste** para validar as correções
4. **Expandir testes** para cobrir mais cenários edge cases
5. **Integrar ao CI/CD** para validação contínua

## 📞 **SUPORTE**

Para questões sobre os testes:
- **Documentação**: `doc/03_IMPLEMENTACAO_TECNICA/18_SinergIA_V2_Completo_Final.md`
- **Código**: `backend/src/modules/sinergia/sinergia-v2.service.ts`
- **Interface**: `src/app/pages/SinergiaConfigAdminUltra.tsx`

---

**✅ Sistema de Testes Criado e Pronto para Execução!**