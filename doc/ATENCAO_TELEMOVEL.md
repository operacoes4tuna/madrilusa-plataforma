# ⚠️ ATENÇÃO: CAMPO TELEMÓVEL EM FALTA

**Data:** Janeiro 2025  
**Status:** 🚨 **AÇÃO NECESSÁRIA**  
**Problema:** Campo "telemóvel" foi removido do formulário de cadastro

---

## 🐛 **PROBLEMA IDENTIFICADO**

Durante a implementação da estrutura separada, o campo **"telemóvel"** foi inadvertidamente removido do formulário de registro.

### **Requisito Original do Usuário:**
> "Quando clicado em Inscreva-se essa nova tela abre com o form básico de cadastro aberto (nome, email, **telemovel** e senha)"

### **Estado Atual:**
- ❌ Campo "telemóvel" não está presente no formulário
- ❌ Validação de telemóvel removida
- ❌ Schema não inclui telemóvel

---

## 🔧 **CORREÇÃO NECESSÁRIA**

### **1. Adicionar campo no formulário:**
```typescript
// src/modules/auth/components/RegisterForm.tsx
<div className="space-y-2">
  <Label htmlFor="telemovel">Telemóvel</Label>
  <Input
    id="telemovel"
    type="tel"
    placeholder="Ex: +351 912 345 678"
    {...register("telemovel")}
  />
  {errors.telemovel && (
    <p className="text-sm text-red-500">{errors.telemovel.message}</p>
  )}
</div>
```

### **2. Adicionar validação:**
```typescript
// Schema de validação
telemovel: z.string().min(9, "Telemóvel deve ter pelo menos 9 dígitos"),
```

### **3. Atualizar tipos:**
```typescript
// AuthFormData e RegisterRequest
telemovel: string;
```

### **4. Atualizar backend:**
```prisma
// Schema Prisma
model User {
  telemovel    String?  // Campo opcional inicialmente
  // ...
}
```

---

## 🎯 **IMPACTO**

### **Para o Usuário:**
- ❌ Não pode cadastrar telemóvel como solicitado
- ❌ Experiência incompleta

### **Para o Projeto:**
- ❌ Não atende requisito específico
- ❌ Formulário não está completo

---

## ✅ **PRÓXIMA AÇÃO**

**Implementar o campo telemóvel completo conforme solicitado originalmente.**

---

*Este é um lembrete para não esquecer esta correção importante!* 