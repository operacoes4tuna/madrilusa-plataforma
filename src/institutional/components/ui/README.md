# 🎨 Componentes UI Institucionais Isolados

## ⚠️ IMPORTANTE

Estes componentes UI são **cópias isoladas** dos componentes shadcn/ui originais (`@/components/ui/`), criados para garantir **isolamento total** entre a home page institucional e a plataforma logada.

## 🔒 Por que o Isolamento?

- **Plataforma usa Shards-React**: Os componentes em `/src/app/` não usam shadcn/ui
- **Home usa shadcn/ui**: Componentes modernos e estilizados
- **Módulos de Auth compartilhados**: LoginForm e RegisterForm usam shadcn/ui original
- **Chatbot compartilhado**: Usa shadcn/ui original

### Risco sem Isolamento
Se modificarmos componentes em `@/components/ui/`, podemos afetar:
- Telas de login/registro
- Chatbot
- Modals de registro por categoria

## 📁 Componentes Disponíveis

| Componente | Usado Em | Propósito |
|-----------|----------|-----------|
| `button.tsx` | Todos componentes | Botões primários e secundários |
| `card.tsx` | RegistrationCards, Activities, Objectives | Cards de conteúdo |
| `input.tsx` | Newsletter, RegistrationModal | Campos de entrada |
| `accordion.tsx` | FAQ | Perguntas expansíveis |
| `dialog.tsx` | RegistrationModal | Modal de registro |
| `select.tsx` | RegistrationModal | Dropdowns de seleção |
| `checkbox.tsx` | RegistrationModal | Checkboxes de acordo |
| `textarea.tsx` | RegistrationModal | Áreas de texto |
| `label.tsx` | Formulários | Labels de campos |

## 🎯 Como Usar

### ✅ Correto - Import Relativo
```tsx
// Em qualquer componente de /src/institutional/components/
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
```

### ❌ Incorreto - Import Absoluto Compartilhado
```tsx
// NÃO use isto em componentes institucionais!
import { Button } from "@/components/ui/button";
```

## 🛠️ Customizações Institucionais

Você pode customizar estes componentes para a home institucional sem afetar outras partes do sistema:

### Exemplo - Adicionar Variant Específico ao Button
```tsx
// src/institutional/components/ui/button.tsx
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        // ...variants existentes
        "institutional-hero": "bg-primary text-white hover:bg-primary-glow shadow-elegant", // Novo!
      },
    },
  }
);
```

## 🔄 Manutenção

### Quando Atualizar
- Quando um novo componente UI for necessário na home
- Quando houver bug no shadcn/ui original que precise ser corrigido
- Quando quiser adicionar variants específicos institucionais

### Como Atualizar
1. Copiar componente de `/src/components/ui/`
2. Adicionar aqui em `/src/institutional/components/ui/`
3. Atualizar imports nos componentes institucionais
4. Testar isolamento com script de validação

## ✅ Validação de Isolamento

Para garantir que não há vazamento:
```bash
# Verificar que nenhum componente institucional usa @/components/ui
grep -r "@/components/ui" src/institutional/

# Se retornar algo, corrija os imports!
```

## 🎨 Identidade Visual Integrada

Estes componentes já respeitam as classes CSS do `institutional-theme.css`:
- Variáveis `--institutional-*`
- Classes `.institutional-*`
- Cores e estilos Madrilusa

## 📝 Regras do Homepage Editor Agent

O agente `homepage-editor` **SEMPRE** deve:
1. Usar componentes deste diretório
2. Nunca modificar `/src/components/ui/` original
3. Validar isolamento após mudanças

---

**Mantido por**: Homepage Editor Agent
**Última atualização**: Janeiro 2025
**Status**: Isolamento 100% garantido ✅
