# ✅ **CHECKLIST DE QUALIDADE - DESENVOLVIMENTO CLAUDE CODE**

## **📋 PRÉ-DESENVOLVIMENTO**

### **Análise de Contexto**
- [ ] 📖 Li o **README.md** para contexto geral do projeto
- [ ] 🚀 Consultei **CLAUDE.md** para padrões de desenvolvimento
- [ ] 📚 Verifiquei documentação relevante em `/doc`
- [ ] 🔍 Identifiquei padrões similares no código existente
- [ ] 📝 Criei **TodoWrite** para organizar tarefas

### **Compreensão Técnica**
- [ ] 🏗️ Entendi a estrutura separada (institutional vs app)
- [ ] 🔧 Identifiquei módulos backend envolvidos
- [ ] 🎨 Compreendi componentes frontend necessários
- [ ] 🤖 Avaliei impacto em sistemas de IA (se aplicável)
- [ ] 🗄️ Analisei mudanças necessárias na base de dados

---

## **🔧 DURANTE O DESENVOLVIMENTO**

### **Padrões de Código**
- [ ] 📝 Seguindo convenções de nomenclatura do projeto
- [ ] 🎯 Usando TypeScript com tipagem rigorosa
- [ ] 🧩 Reutilizando componentes existentes (shadcn/ui)
- [ ] 🔄 Mantendo padrão modular do backend
- [ ] 📁 Organizando arquivos na estrutura correta

### **Qualidade Técnica**
- [ ] 🎨 Aplicando identidade visual oficial (cores Madrilusa)
- [ ] 🇵🇹 Usando português de Portugal em toda interface
- [ ] 📱 Garantindo responsividade mobile
- [ ] ♿ Considerando acessibilidade básica
- [ ] 🔐 Implementando validações necessárias

### **Integração com Sistema**
- [ ] 🔗 Integração adequada com React Query
- [ ] 🛡️ Seguindo padrões de autenticação existentes
- [ ] 📊 Mantendo consistência com APIs existentes
- [ ] 🏷️ Usando tipos TypeScript compartilhados
- [ ] 🎯 Alinhamento com categorias de usuário

---

## **🤖 SISTEMAS DE IA (SE APLICÁVEL)**

### **Integração OpenAI**
- [ ] 🔑 Usando configuração centralizada (backend/.env)
- [ ] 🛡️ Implementando rate limiting adequado
- [ ] 🧹 Aplicando sanitização de dados sensíveis
- [ ] 📊 Adicionando logs para analytics
- [ ] ⚡ Definindo timeouts apropriados

### **Contexto e Prompts**
- [ ] 🎯 Prompts específicos para categoria de usuário
- [ ] 🇵🇹 Linguagem portuguesa de Portugal nos prompts
- [ ] 📝 Instruções claras e contextualizadas
- [ ] 🏷️ Integração com sistema de tags existente
- [ ] 🔄 Fallback para erros de IA

---

## **✅ PÓS-DESENVOLVIMENTO**

### **Validação Técnica**
- [ ] 🔍 **`npm run lint`** executa sem erros
- [ ] 🎯 **`npm run type-check`** executa sem erros
- [ ] 🚀 **`npm run dev:full`** inicia sem problemas
- [ ] 🧪 **`npm run validate`** passa em todos os checks
- [ ] 🎉 **`npm run check:claude`** validação completa OK

### **Testes Funcionais**
- [ ] ✅ Funcionalidade principal opera conforme especificado
- [ ] 🔄 Integração com sistema existente funciona
- [ ] 🌍 Testado com diferentes categorias de usuário
- [ ] 📊 Casos edge e cenários de erro tratados
- [ ] 📱 Responsividade verificada em mobile

### **Testes de Usuário**
- [ ] 🌍 **Imigrante**: `[✅ OK / ❌ Problema / N/A]`
- [ ] 🏢 **Empresa**: `[✅ OK / ❌ Problema / N/A]`
- [ ] 🏛️ **Município**: `[✅ OK / ❌ Problema / N/A]`
- [ ] 🎓 **Academia**: `[✅ OK / ❌ Problema / N/A]`
- [ ] 👨‍👩‍👧‍👦 **Família**: `[✅ OK / ❌ Problema / N/A]`
- [ ] 🛡️ **Admin**: `[✅ OK / ❌ Problema / N/A]`

---

## **📊 PERFORMANCE E UX**

### **Métricas de Performance**
- [ ] ⚡ Tempo de carregamento `< 2s`
- [ ] 🔄 Tempo de resposta API `< 100ms`
- [ ] 📱 Funciona bem em dispositivos móveis
- [ ] 🧠 Uso eficiente de memória
- [ ] 📊 Sem degradação de performance geral

### **Experiência do Usuário**
- [ ] 🎨 Interface consistente com design system
- [ ] 🧭 Navegação intuitiva e lógica
- [ ] 📝 Mensagens de erro claras e úteis
- [ ] ⏳ Estados de loading apropriados
- [ ] 🎯 Fluxo do usuário fluido e natural

---

## **🔐 SEGURANÇA E VALIDAÇÕES**

### **Segurança de Dados**
- [ ] 🛡️ Validações duplas (backend + frontend)
- [ ] 🧹 Sanitização adequada de inputs
- [ ] 🔐 Não exposição de dados sensíveis
- [ ] 🚫 Proteção contra ataques comuns (XSS, injection)
- [ ] 📊 Logs não contêm informações sensíveis

### **Validações de Negócio**
- [ ] ✅ Regras de negócio implementadas corretamente
- [ ] 🎯 Validações específicas por categoria de usuário
- [ ] 🔄 Integridade referencial mantida
- [ ] 📋 Campos obrigatórios respeitados
- [ ] 🎨 Feedback visual adequado para validações

---

## **📚 DOCUMENTAÇÃO**

### **Código Documentado**
- [ ] 💬 Comentários relevantes no código (quando necessário)
- [ ] 🏷️ Tipos TypeScript bem definidos
- [ ] 📝 Interfaces documentadas adequadamente
- [ ] 🔗 JSDoc para funções complexas (se aplicável)
- [ ] 📋 README de módulos específicos (se necessário)

### **Documentação do Projeto**
- [ ] 📚 **README.md** atualizado (se mudança significativa)
- [ ] 🚀 **CLAUDE.md** atualizado (se impacta desenvolvimento)
- [ ] 📋 Documentação técnica em `/doc` (se necessário)
- [ ] 📊 Status de implementação atualizado (se aplicável)
- [ ] 🔄 Changelog mantido (se versioning aplicável)

---

## **🔄 INTEGRAÇÃO E DEPLOYMENT**

### **Preparação para Produção**
- [ ] 🎯 Build de produção funciona (`npm run build`)
- [ ] 🗄️ Migrations de banco funcionais (se aplicável)
- [ ] 🔧 Variáveis de ambiente configuradas
- [ ] 📊 Logs apropriados para monitoramento
- [ ] 🚀 Deploy não quebra funcionalidades existentes

### **Comunicação**
- [ ] 📢 Stakeholders informados sobre mudanças importantes
- [ ] 📋 Documentação de release preparada (se aplicável)
- [ ] 🎯 Impacto em usuários finais avaliado
- [ ] 🔄 Plano de rollback definido (se necessário)
- [ ] 📞 Canais de suporte informados sobre mudanças

---

## **🚨 VERIFICAÇÕES FINAIS**

### **Conformidade com Madrilusa**
- [ ] 🎯 **Missão**: Alinhado com integração social de imigrantes
- [ ] 🎨 **Identidade**: Cores e tipografia oficiais aplicadas
- [ ] 🇵🇹 **Linguagem**: Português de Portugal em toda interface
- [ ] 🏢 **Entidades**: Respeita as 4 organizações promotoras
- [ ] 📊 **Categorias**: Compatível com 5 tipos de usuário

### **Padrões Claude Code**
- [ ] 📋 TodoWrite usado para organização
- [ ] 🔍 Ferramentas (Read, Grep, Glob) usadas eficientemente
- [ ] 📝 Documentação seguindo templates do projeto
- [ ] 🎯 Foco na tarefa específica solicitada
- [ ] 🚀 Resultado pronto para uso imediato

---

## **📈 MÉTRICAS DE SUCESSO**

### **KPIs Técnicos**
- [ ] 🎯 **Funcionalidade**: `100%` operacional
- [ ] ⚡ **Performance**: Dentro dos limites estabelecidos
- [ ] 🐛 **Bugs**: `0` bugs críticos ou de alta prioridade
- [ ] 📊 **Coverage**: Funcionalidades testadas adequadamente
- [ ] 🔧 **Manutenibilidade**: Código limpo e bem estruturado

### **KPIs de Negócio**
- [ ] 👥 **Usabilidade**: Interface intuitiva para usuários finais
- [ ] 🎯 **Adoção**: Facilita objetivos do projeto social
- [ ] 📈 **Escalabilidade**: Suporta crescimento futuro
- [ ] 🤝 **Integração**: Melhora conexão entre categorias
- [ ] 🌟 **Impacto**: Contribui para missão de integração social

---

## **💡 PRÓXIMOS PASSOS (OPCIONAL)**

### **Melhorias Futuras Identificadas**
- [ ] `[Melhoria 1 identificada durante desenvolvimento]`
- [ ] `[Melhoria 2 identificada durante desenvolvimento]`
- [ ] `[Melhoria 3 identificada durante desenvolvimento]`

### **Monitoramento Pós-Deploy**
- [ ] 📊 Acompanhar métricas de uso
- [ ] 🐛 Monitorar logs de erro
- [ ] 👥 Coletar feedback dos usuários
- [ ] 📈 Avaliar impacto na performance geral

---

**🎉 CHECKLIST COMPLETO = DESENVOLVIMENTO DE QUALIDADE**

---

*Checklist criado para garantir consistência e qualidade no desenvolvimento com Claude Code*
*Projeto Madrilusa - Janeiro 2025*