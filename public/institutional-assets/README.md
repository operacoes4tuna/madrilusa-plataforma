# 🎨 Assets Institucionais Isolados

## ⚠️ IMPORTANTE

Este diretório contém **cópias isoladas** dos assets visuais usados exclusivamente na **home page institucional** do Madrilusa.

## 🔒 Por que o Isolamento?

Os logos originais em `/public/logo_madrilusa/` são compartilhados com a plataforma:
- **Sidebar da plataforma** usa `logo madrilusa.png`
- **MainSidebar** usa `barradelogosmadrilusa.png`

Ao criar cópias isoladas, garantimos que:
- ✅ Modificações na home não afetam a plataforma
- ✅ Modificações na plataforma não afetam a home
- ✅ Cada área pode evoluir independentemente

## 📁 Assets Disponíveis

| Asset | Usado Em | Propósito |
|-------|----------|-----------|
| `logo-madrilusa-home.png` | InstitutionalHeader, Footer | Logo principal da home |
| `barra-logos-home.png` | Footer | Barra de logos dos parceiros |
| `logo-branco-home.png` | (Reserva) | Logo branco para fundos escuros |

## 🎯 Como Usar

### ✅ Correto - Assets Isolados
```tsx
// Em qualquer componente institucional
<img
  src="/institutional-assets/logo-madrilusa-home.png"
  alt="Madrilusa"
/>
```

### ❌ Incorreto - Assets Compartilhados
```tsx
// NÃO use em novos componentes institucionais!
<img
  src="/logo_madrilusa/logo madrilusa.png"
  alt="Madrilusa"
/>
```

## 🔄 Manutenção

### Quando Adicionar Novos Assets
1. Coloque o arquivo original em `/public/institutional-assets/`
2. Use nomenclatura descritiva (ex: `hero-background-v2.jpg`)
3. Documente o uso neste README

### Quando Atualizar Assets Existentes
1. Substitua o arquivo mantendo o mesmo nome
2. Valide que a mudança não quebra a home
3. Use Playwright para validação visual

## 🎨 Diretrizes de Assets

### Imagens
- **Formato**: PNG para logos (transparência), JPG para fotos
- **Otimização**: Comprimir antes de adicionar (usar TinyPNG, ImageOptim)
- **Naming**: Kebab-case (ex: `hero-image-mobile.jpg`)

### Logos
- **Principal**: 4KB, transparente, alta qualidade
- **Barra**: 77KB, todos logos parceiros
- **Branco**: Para fundos escuros/coloridos

## 📊 Assets Atuais

```
institutional-assets/
├── logo-madrilusa-home.png        (4 KB - Logo principal)
├── barra-logos-home.png           (77 KB - Parceiros)
├── logo-branco-home.png           (4 KB - Variante branca)
└── README.md                      (Este arquivo)
```

## ✅ Validação

Para verificar que componentes estão usando assets corretos:
```bash
# Ver quais componentes usam assets compartilhados
grep -r "/logo_madrilusa/" src/institutional/

# Ver quais usam assets isolados
grep -r "/institutional-assets/" src/institutional/
```

## 🚀 Próximos Assets Planejados

- [ ] Favicon específico para home (opcional)
- [ ] Imagens otimizadas para cada seção
- [ ] Ícones SVG customizados
- [ ] Backgrounds específicos

## 📝 Regras do Homepage Editor Agent

O agente `homepage-editor` **DEVE**:
1. Sempre usar assets de `/institutional-assets/` em novos componentes
2. Adicionar novos assets aqui quando necessário
3. Otimizar imagens antes de adicionar
4. Documentar novos assets neste README

---

**Mantido por**: Homepage Editor Agent
**Última atualização**: Janeiro 2025
**Status**: Isolamento 100% garantido ✅
