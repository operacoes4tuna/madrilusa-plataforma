# 📁 ORGANIZAÇÃO DE ARQUIVOS - PROJETO MADRILUSA

**Data:** Janeiro 2025  
**Objetivo:** Manter estrutura organizada e consistente

---

## 🎯 **DIRETRIZES GERAIS**

### **📋 Documentação (arquivos .md)**
- ✅ **SEMPRE** criar na pasta `doc/`
- ❌ **NUNCA** criar arquivos .md na raiz do projeto
- ✅ Usar nomes descritivos em MAIÚSCULAS para documentação técnica
- ✅ Manter documentação atualizada após mudanças

### **💻 Código Frontend**
```
src/
├── institutional/    # Marketing - página institucional
├── app/             # Desenvolvimento - aplicação
├── modules/         # Módulos isolados (auth, etc.)
├── shared/          # Componentes compartilhados
└── components/      # Utilitários gerais
```

### **🔧 Código Backend**
```
backend/
├── src/modules/     # Módulos por funcionalidade
├── src/shared/      # Utilitários compartilhados
├── prisma/          # Schema e migrations
└── ...
```

---

## 📂 **ESTRUTURA DA PASTA `doc/`**

### **Documentação do Projeto:**
- `Guia Completo de Conteúdo e Seções do Madrilusa.md`
- `Manual de Identidade Visual e Comunicação - Madrilusa.md`
- `Guia de Inscrições na Plataforma Madrilusa.md`

### **Documentação Técnica:**
- `ESTRUTURA_SEPARADA.md` - Separação institucional vs app
- `GUIA_EQUIPES.md` - Como as equipes devem trabalhar
- `Status da Implementação - Backend Modular.md`
- `Roadmap - Estruturação Modular do Backend.md`

### **Avisos e Lembretes:**
- `ATENCAO_TELEMOVEL.md` - Correções pendentes
- `IMPLEMENTACAO_CONCLUIDA.md` - Status de implementações

---

## 🚨 **REGRAS IMPORTANTES**

### **Para TODOS os desenvolvedores:**
1. **Documentação** sempre em `doc/`
2. **Não** criar arquivos temporários na raiz
3. **Manter** estrutura de pastas consistente
4. **Documentar** mudanças importantes

### **Para Marketing:**
- Trabalhar apenas em `src/institutional/`
- Não modificar estrutura de pastas
- Documentar mudanças visuais importantes

### **Para Desenvolvimento:**
- Respeitar separação `institutional/` vs `app/`
- Documentar novos módulos e funcionalidades
- Manter backend organizado por módulos

---

## ✅ **CHECKLIST ANTES DO COMMIT**

- [ ] Arquivos .md estão em `doc/`?
- [ ] Código está na pasta correta?
- [ ] Estrutura de pastas respeitada?
- [ ] Documentação atualizada se necessário?

---

## 📋 **EXEMPLO DE BOA ORGANIZAÇÃO**

```
madrilusasite/
├── doc/                           ← TODA documentação aqui
│   ├── GUIA_EQUIPES.md
│   ├── ESTRUTURA_SEPARADA.md
│   └── ...
├── src/
│   ├── institutional/             ← Marketing
│   ├── app/                      ← Desenvolvimento
│   └── ...
├── backend/                      ← API organizada
└── README.md                     ← Único .md na raiz
```

---

**🎯 Objetivo: Projeto limpo, organizado e fácil de navegar para todas as equipes!** 