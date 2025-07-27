# 👥 GUIA PARA AS EQUIPES - ESTRUTURA SEPARADA

**Para:** Marketing e Desenvolvimento  
**Objetivo:** Trabalhar independentemente sem conflitos

---

## 🎨 **EQUIPE MARKETING**

### **📁 Seus Arquivos:**
```
src/institutional/
├── components/              ← SEUS COMPONENTES
├── pages/LandingPage.tsx   ← SUA PÁGINA
└── styles/institutional-theme.css ← SEU CSS
```

### **🎯 O que você pode fazer:**
- ✅ Editar qualquer componente em `institutional/components/`
- ✅ Modificar cores em `institutional-theme.css`
- ✅ Alterar textos, imagens, layout da landing page
- ✅ Adicionar novas seções à página institucional
- ✅ Ajustar responsividade mobile

### **⚠️ O que NÃO tocar:**
- ❌ Pasta `app/` (aplicação dos usuários)
- ❌ Pasta `modules/` (funcionalidades)
- ❌ Pasta `backend/` (servidor)
- ❌ Arquivos `App.tsx`, rotas, etc.

### **🚀 Para testar suas mudanças:**
```bash
npm run dev:full
# Acesse: http://localhost:8080
```

---

## 💻 **EQUIPE DESENVOLVIMENTO**

### **📁 Seus Arquivos:**
```
src/app/                    ← SUA APLICAÇÃO
src/modules/               ← SEUS MÓDULOS
src/shared/                ← COMPARTILHADO
backend/                   ← SEU BACKEND
```

### **🎯 O que você pode fazer:**
- ✅ Criar páginas em `app/pages/`
- ✅ Adicionar rotas em `App.tsx`
- ✅ Modificar `AppLayout.tsx`
- ✅ Desenvolver novos módulos
- ✅ Evoluir o backend

### **⚠️ O que NÃO tocar:**
- ❌ Pasta `institutional/` (landing page)

### **🚀 Para testar suas mudanças:**
```bash
npm run dev:full
# Aplicação: http://localhost:8080/app
# Backend: http://localhost:3001
```

---

## 🤝 **TRABALHO EM CONJUNTO**

### **Modal de Autenticação:**
- **Marketing:** Pode ajustar visual se necessário
- **Desenvolvimento:** Controla funcionalidade e redirecionamentos
- **Localização:** `src/modules/auth/` (development)

### **Identidade Visual:**
- **Marketing:** `institutional-theme.css` (cores da landing)
- **Desenvolvimento:** `app-theme.css` (cores da aplicação)
- **Base:** Ambos usam as mesmas cores Madrilusa (#F5A623, #4A90A4)

---

## 🚨 **REGRAS IMPORTANTES**

### **Para Marketing:**
1. **Sempre** teste antes de fazer commit
2. **Não** delete arquivos sem confirmar
3. **Mantenha** identidade visual Madrilusa
4. **Comunique** mudanças grandes

### **Para Desenvolvimento:**
1. **Não** quebre funcionalidades da landing
2. **Mantenha** modal de auth funcionando
3. **Preserve** redirecionamentos
4. **Documente** novas funcionalidades

---

## ✅ **CHECKLIST ANTES DO COMMIT**

### **Marketing:**
- [ ] Landing page carrega sem erros
- [ ] Modal de auth abre e fecha
- [ ] Responsividade mobile OK
- [ ] Cores Madrilusa mantidas

### **Desenvolvimento:**
- [ ] Login/cadastro funciona
- [ ] Redirecionamento para `/app` OK
- [ ] Rotas protegidas funcionando
- [ ] Backend respondendo

---

## 🆘 **EM CASO DE PROBLEMAS**

### **Landing page não carrega:**
1. Verifique imports em `LandingPage.tsx`
2. Confirme que componentes existem
3. Teste `npm run dev:full`

### **Aplicação não funciona:**
1. Backend rodando? `npm run dev:backend`
2. Rotas em `App.tsx` corretas?
3. Componentes em `app/` existem?

### **Conflitos entre equipes:**
1. **Comuniquem-se** antes de mudanças grandes
2. **Testem** em conjunto depois de merges
3. **Documentem** mudanças importantes

---

**🎯 O objetivo é autonomia total para cada equipe sem interferências!** 