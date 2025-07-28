# Orientações UX/UI - Baseado em Shards Dashboard

Este repositório contém um guia completo de design system baseado no [Shards Dashboard](https://designrevision.com/demo/shards-dashboard-lite-react/blog-overview), adaptado para desenvolvimento com **React 18.3.1**, **TypeScript**, **Vite 5.4.1**, **Tailwind CSS 3.4.11** e **shadcn/ui**.

## 📁 Arquivos Incluídos

- **`ux-ui-guidelines.json`** - Guia completo em formato JSON com todos os padrões de design
- **`README.md`** - Este arquivo com instruções de uso
- **`analise_dashboard.md`** - Análise detalhada do dashboard de referência

## 🎯 Como Usar Este Guia

### 1. Configuração Inicial

Primeiro, configure seu projeto com as dependências necessárias:

```bash
# Instalar shadcn/ui
npx shadcn-ui@latest init

# Instalar React Query
npm install @tanstack/react-query

# Instalar dependências adicionais
npm install lucide-react class-variance-authority clsx tailwind-merge
```

### 2. Configuração do Tailwind CSS

Adicione as cores personalizadas ao seu `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.slate,
        success: colors.green,
        danger: colors.red,
        warning: colors.amber,
        info: colors.cyan,
      },
      spacing: {
        'sidebar': '16rem',
        'header': '4rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### 3. Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── layout/          # Header, Sidebar, etc.
│   ├── features/        # Componentes específicos
│   └── common/          # Componentes reutilizáveis
├── hooks/               # Custom hooks
├── lib/                 # Utilitários
├── styles/              # CSS global
└── types/               # Tipos TypeScript
```

## 🎨 Sistema de Design

### Cores Principais

O sistema de cores segue o padrão do Tailwind CSS:

- **Primary**: Blue (Azul) - Para ações principais
- **Secondary**: Slate (Cinza) - Para elementos secundários  
- **Success**: Green (Verde) - Para estados de sucesso
- **Danger**: Red (Vermelho) - Para erros e ações destrutivas
- **Warning**: Amber (Âmbar) - Para avisos
- **Info**: Cyan (Ciano) - Para informações

### Tipografia

- **Fonte**: Inter (fallback: system-ui, sans-serif)
- **Escalas**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Pesos**: normal (400), medium (500), semibold (600), bold (700)

### Espaçamento

Baseado na escala do Tailwind CSS (múltiplos de 0.25rem):
- **xs**: 0.25rem (1)
- **sm**: 0.5rem (2)  
- **md**: 1rem (4)
- **lg**: 1.5rem (6)
- **xl**: 2rem (8)
- **2xl**: 3rem (12)

## 🧩 Componentes Principais

### 1. Metric Card

Card para exibir métricas principais com indicadores de mudança:

```jsx
const MetricCard = ({ title, value, change, changeType, chart }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
    <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
      {title}
    </h3>
    <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
    <div className={`flex items-center text-sm mt-2 ${
      changeType === 'positive' ? 'text-green-600' : 
      changeType === 'negative' ? 'text-red-600' : 'text-slate-500'
    }`}>
      {change}
    </div>
    {chart && <div className="mt-4 h-16">{chart}</div>}
  </div>
);
```

### 2. Sidebar Navigation

Navegação lateral com ícones e estados ativos:

```jsx
const SidebarNav = ({ items, activeItem }) => (
  <nav className="py-4">
    {items.map((item) => (
      <a
        key={item.id}
        href={item.href}
        className={`flex items-center px-6 py-3 ${
          activeItem === item.id
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
        <span className="font-medium">{item.label}</span>
      </a>
    ))}
  </nav>
);
```

### 3. Layout Principal

Layout com sidebar e header fixos:

```jsx
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    {/* Sidebar */}
    <aside className="w-64 fixed left-0 top-0 h-full bg-white border-r border-slate-200">
      <SidebarNav />
    </aside>
    
    {/* Header */}
    <header className="h-16 fixed top-0 right-0 left-64 bg-white border-b border-slate-200">
      <HeaderContent />
    </header>
    
    {/* Main Content */}
    <main className="ml-64 mt-16 p-6">
      {children}
    </main>
  </div>
);
```

## 📱 Responsividade

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Padrões Responsivos

```jsx
// Grid responsivo para métricas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">

// Sidebar responsiva
<aside className="hidden md:block w-64 fixed left-0 top-0 h-full">

// Conteúdo principal responsivo  
<main className="ml-0 md:ml-64 mt-16 p-4 md:p-6">
```

## 🔧 Melhores Práticas

### Performance
- Use `React.memo` para componentes que renderizam frequentemente
- Implemente lazy loading para rotas
- Use `useMemo` e `useCallback` quando apropriado

### Acessibilidade
- Mantenha contraste mínimo de 4.5:1
- Use foco visível em elementos interativos
- Forneça labels descritivos para formulários
- Implemente navegação por teclado

### Organização do Código
- Mantenha componentes pequenos e focados
- Use TypeScript para type safety
- Implemente error boundaries
- Use custom hooks para lógica reutilizável

## 📚 Recursos Úteis

### Documentação
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [React](https://react.dev/reference/react)

### Ferramentas Recomendadas
- **Design**: Figma
- **Documentação**: Storybook
- **Formatação**: ESLint + Prettier
- **Git Hooks**: Husky
- **Testing**: React Testing Library

### Inspiração
- [Shards Dashboard](https://designrevision.com/demo/shards-dashboard-lite-react/)
- [shadcn/ui Examples](https://ui.shadcn.com/examples/dashboard)
- [Tailwind UI](https://tailwindui.com/components)
- [Radix UI](https://www.radix-ui.com/)

## 🚀 Próximos Passos

1. **Configure o projeto** com as dependências listadas
2. **Implemente o layout base** usando os padrões fornecidos
3. **Crie os componentes principais** seguindo os exemplos
4. **Teste a responsividade** em diferentes dispositivos
5. **Documente seus componentes** usando Storybook
6. **Implemente testes** para garantir qualidade

---

**Desenvolvido com base no Shards Dashboard para otimizar o desenvolvimento com React, Vite, Tailwind CSS e shadcn/ui.**

