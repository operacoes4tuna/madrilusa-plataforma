# 🏢 PLANO IMPLEMENTAÇÃO: CATEGORIA EMPRESA - FASE 2

**Data:** Janeiro 2025  
**Status:** 📋 **AGUARDANDO APROVAÇÃO**  
**Base:** ✅ Padrão modular estabelecido na Fase 1 (Imigrante)  
**Objetivo:** Implementar sistema completo para cadastro e gestão de perfis de empresa

---

## 📋 **VISÃO GERAL DA FASE 2**

### **Contexto**
Com a categoria Imigrante implementada e funcional, a Fase 2 visa expandir o sistema para **Empresas** - organizações que oferecem oportunidades de trabalho e desejam acessar a base de imigrantes qualificados.

### **Estratégia**
- ✅ **Aproveitar estrutura modular** já estabelecida
- ✅ **Seguir padrões técnicos** validados na Fase 1  
- ✅ **Reutilizar componentes** (modal, sidebar, validações)
- ✅ **Manter consistência** UX/UI com categoria existente

### **Escopo da Implementação**
- 🎯 **Backend:** Módulo `empresas/` completo
- 🎯 **Database:** Model `PerfilEmpresa` + relação 1:1
- 🎯 **Frontend:** Página + componentes específicos
- 🎯 **Integração:** Modal registro + navegação dashboard

---

## 🗄️ **ESTRUTURA DE DADOS - PERFIL EMPRESA**

### **Campos Identificados (Guia de Inscrições)**

#### **Dados Básicos (já no User)**
- ✅ **Nome Completo:** Nome do responsável (User.nomeCompleto)
- ✅ **Email:** Email de contato (User.email)  
- ✅ **Telefone:** Telefone de contacto (User.telemovel)
- ✅ **Senha:** Para acesso à plataforma (User.senha)

#### **Dados Específicos (PerfilEmpresa)**
- 🆕 **Nome da Empresa** (obrigatório)
- 🆕 **Pessoa de Contacto** (opcional) - Nome do responsável
- 🆕 **Morada** (opcional) - Endereço da empresa  
- 🆕 **Observações** (opcional) - Vagas, requisitos, detalhes

### **Schema Prisma - PerfilEmpresa**
```prisma
model PerfilEmpresa {
  id                String   @id @default(cuid())
  userId            String   @unique
  nomeEmpresa       String   // ✨ Obrigatório: Nome da empresa
  pessoaContacto    String?  // ✨ Opcional: Nome do responsável
  morada            String?  // ✨ Opcional: Endereço da empresa
  observacoes       String?  // ✨ Opcional: Vagas, requisitos, detalhes
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // 🔗 Relação 1:1 com User (padrão estabelecido)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("perfis_empresa")
}
```

### **Atualização User Model**
```prisma
model User {
  // ... campos existentes ...
  categoria           String?  // IMIGRANTE | EMPRESA | ...
  
  // 🔗 Relações com perfis específicos
  perfilImigrante     PerfilImigrante?     // ✅ Existente
  perfilEmpresa       PerfilEmpresa?       // 🆕 Nova relação
  // ... futuras relações ...
  
  @@map("users")
}
```

---

## 🔧 **IMPLEMENTAÇÃO BACKEND**

### **Estrutura Modular (Padrão Estabelecido)**
```
✅ backend/src/modules/empresas/          # 🆕 Novo módulo
├── empresa.controller.ts                # CRUD + validações
├── empresa.service.ts                   # Lógica de negócio
├── empresa.routes.ts                    # Endpoints RESTful  
└── empresa.types.ts                     # Interfaces específicas
```

### **Endpoints API (Seguindo Padrão)**
```typescript
// 🏢 Perfil de Empresa (mesmo padrão de imigrantes)
GET    /api/empresas/perfil/:userId      // Buscar perfil específico
POST   /api/empresas/perfil             // Criar perfil específico
PUT    /api/empresas/perfil/:userId      // Atualizar perfil específico  
DELETE /api/empresas/perfil/:userId      // Deletar perfil específico
GET    /api/empresas/has-perfil/:userId  // Verificar se tem perfil
GET    /api/empresas/list               // Listar todas as empresas
```

### **Types e Interfaces**
```typescript
// 🆕 backend/src/modules/empresas/empresa.types.ts
export interface PerfilEmpresa {
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePerfilEmpresaRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface UpdatePerfilEmpresaRequest {
  nomeEmpresa?: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface PerfilEmpresaResponse {
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Service Layer (Padrão Estabelecido)**
```typescript
// 🆕 backend/src/modules/empresas/empresa.service.ts
export class EmpresaService {
  // ✅ Métodos padrão (mesmo padrão de ImigranteService)
  async createPerfil(data: CreatePerfilEmpresaRequest): Promise<PerfilEmpresa>
  async getPerfilByUserId(userId: string): Promise<PerfilEmpresa | null>
  async updatePerfil(userId: string, data: UpdatePerfilEmpresaRequest): Promise<PerfilEmpresa>
  async deletePerfil(userId: string): Promise<void>
  async listPerfis(): Promise<PerfilEmpresa[]>
  async hasPerfilByUserId(userId: string): Promise<boolean>
}
```

### **Controller Layer (Padrão Estabelecido)**
```typescript
// 🆕 backend/src/modules/empresas/empresa.controller.ts
export class EmpresaController {
  // ✅ Métodos padrão (mesmo padrão de ImigranteController)
  async createPerfil(req: Request, res: Response)       // POST
  async getPerfilByUserId(req: Request, res: Response)  // GET /:userId
  async updatePerfil(req: Request, res: Response)       // PUT /:userId
  async deletePerfil(req: Request, res: Response)       // DELETE /:userId
  async listPerfis(req: Request, res: Response)         // GET /
  async hasPerfilByUserId(req: Request, res: Response)  // GET /has-perfil/:userId
  
  // 🆕 Validações específicas para empresa
  private validateEmpresaData(data: any): string[]
}
```

---

## 💻 **IMPLEMENTAÇÃO FRONTEND**

### **Estrutura de Componentes (Expansão do Padrão)**
```
✅ src/app/pages/
└── PerfilEmpresa.tsx                    # 🆕 Nova página dashboard

✅ src/app/components/user-profile/
└── EmpresaDetails.tsx                   # 🆕 Formulário específico

✅ src/modules/auth/components/
└── CategoryRegistrationModal.tsx        # ✅ Expandir para EMPRESA
```

### **Página PerfilEmpresa (Padrão Estabelecido)**
```typescript
// 🆕 src/app/pages/PerfilEmpresa.tsx
import React from 'react';
import { Container, Row, Col } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import UserDetails from '../components/user-profile/UserDetails';
import EmpresaDetails from '../components/user-profile/EmpresaDetails';

const PerfilEmpresa: React.FC = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Perfil de Empresa"
          subtitle="Gestão do seu perfil empresarial"
          md="12"
          className="ml-sm-auto mr-sm-auto"
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails />                 {/* ✅ Reutilizar existente */}
        </Col>
        <Col lg="8">
          <EmpresaDetails />              {/* 🆕 Novo componente */}
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilEmpresa;
```

### **Componente EmpresaDetails (Baseado em ImigranteDetails)**
```typescript
// 🆕 src/app/components/user-profile/EmpresaDetails.tsx
interface EmpresaDetailsProps {
  title?: string;
}

interface EmpresaFormData {
  nomeEmpresa: string;
  pessoaContacto: string;
  morada: string;
  observacoes: string;
}

const EmpresaDetails: React.FC<EmpresaDetailsProps> = ({ 
  title = "Perfil de Empresa" 
}) => {
  // ✅ Estados (seguindo padrão ImigranteDetails)
  const [formData, setFormData] = useState<EmpresaFormData>({
    nomeEmpresa: '',
    pessoaContacto: '',
    morada: '',
    observacoes: ''
  });
  const [perfilData, setPerfilData] = useState<PerfilEmpresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Hooks (seguindo padrão estabelecido)
  const { user } = useAuth();
  const { toast } = useToast();

  // ✅ Fetch perfil existente
  useEffect(() => {
    const fetchPerfilEmpresa = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/empresas/perfil/${user.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          setFormData({
            nomeEmpresa: perfil.nomeEmpresa || '',
            pessoaContacto: perfil.pessoaContacto || '',
            morada: perfil.morada || '',
            observacoes: perfil.observacoes || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil empresa:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilEmpresa();
  }, [user?.id]);

  // ✅ Handlers de formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      const method = perfilData ? 'PUT' : 'POST';
      const url = perfilData 
        ? `/api/empresas/perfil/${user.id}`
        : '/api/empresas/perfil';
      
      const body = perfilData 
        ? formData  // Update
        : { ...formData, userId: user.id };  // Create

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        setPerfilData(result.data);
        toast({
          title: "Sucesso!",
          description: "Perfil de empresa atualizado com sucesso.",
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar perfil de empresa.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Carregando perfil de empresa...</div>;
  }

  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="nomeEmpresa">Nome da Empresa *</label>
                  <FormInput
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite o nome da empresa"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="pessoaContacto">Pessoa de Contacto</label>
                  <FormInput
                    id="pessoaContacto"
                    name="pessoaContacto"
                    value={formData.pessoaContacto}
                    onChange={handleInputChange}
                    placeholder="Nome do responsável"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="morada">Morada</label>
                  <FormInput
                    id="morada"
                    name="morada"
                    value={formData.morada}
                    onChange={handleInputChange}
                    placeholder="Endereço da empresa"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="observacoes">Observações Adicionais</label>
                  <FormTextarea
                    id="observacoes"
                    name="observacoes"
                    rows={4}
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Informações sobre vagas, requisitos ou outros detalhes relevantes"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <Button 
              type="submit" 
              disabled={isSaving}
              className="mt-3"
            >
              {isSaving ? 'Salvando...' : 'Salvar Perfil de Empresa'}
            </Button>
          </Form>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default EmpresaDetails;
```

### **Modal de Registro (Expansão do Existente)**
```typescript
// ✅ src/modules/auth/components/CategoryRegistrationModal.tsx
// Adicionar caso para EMPRESA no Step 2

// 🆕 Formulário específico para empresa
const renderEmpresaForm = () => (
  <>
    <div>
      <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
      <Input
        id="nomeEmpresa"
        {...empresaForm.register("nomeEmpresa")}
        placeholder="Digite o nome da empresa"
      />
      {empresaForm.formState.errors.nomeEmpresa && (
        <p className="text-red-500 text-sm mt-1">
          {empresaForm.formState.errors.nomeEmpresa.message}
        </p>
      )}
    </div>

    <div>
      <Label htmlFor="pessoaContacto">Pessoa de Contacto</Label>
      <Input
        id="pessoaContacto"
        {...empresaForm.register("pessoaContacto")}
        placeholder="Nome do responsável (opcional)"
      />
    </div>

    <div>
      <Label htmlFor="morada">Morada</Label>
      <Input
        id="morada"
        {...empresaForm.register("morada")}
        placeholder="Endereço da empresa (opcional)"
      />
    </div>

    <div>
      <Label htmlFor="observacoes">Observações Adicionais</Label>
      <Textarea
        id="observacoes"
        {...empresaForm.register("observacoes")}
        rows={4}
        placeholder="Vagas disponíveis, requisitos, outros detalhes..."
      />
    </div>
  </>
);

// 🆕 Schema de validação Zod para empresa
const empresaRegistrationSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  pessoaContacto: z.string().optional(),
  morada: z.string().optional(),
  observacoes: z.string().optional(),
});
```

### **Navegação Condicional (Expansão)**
```typescript
// ✅ src/app/components/layout/MainSidebar.tsx
// Expandir menu condicional para EMPRESA

const categoryMenuItems = [];

if (user?.categoria === USER_CATEGORIES.IMIGRANTE) {
  categoryMenuItems.push({
    title: 'Perfil de Imigrante',
    to: '/app/perfil-imigrante',
    iconClass: 'language',
    htmlAfter: ''
  });
}

// 🆕 Menu para empresa
if (user?.categoria === USER_CATEGORIES.EMPRESA) {
  categoryMenuItems.push({
    title: 'Perfil de Empresa',
    to: '/app/perfil-empresa',
    iconClass: 'business',
    htmlAfter: ''
  });
}

const sidebarNavItems = [...baseSidebarNavItems, ...categoryMenuItems];
```

### **Roteamento (Expansão)**
```typescript
// ✅ src/App.tsx
// Adicionar nova rota para empresa

import PerfilEmpresa from "./app/pages/PerfilEmpresa";

// Dentro das rotas protegidas:
<Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
  <Route index element={<Dashboard />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
  <Route path="perfil-imigrante" element={<PerfilImigrante />} />
  <Route path="perfil-empresa" element={<PerfilEmpresa />} />   {/* 🆕 Nova rota */}
</Route>
```

---

## 📊 **TIPOS TYPESCRIPT ATUALIZADOS**

### **shared-types/api.types.ts (Expansão)**
```typescript
// ✅ Adicionar tipos para empresa

// 🆕 Interface PerfilEmpresa
export interface PerfilEmpresa {
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 🆕 Requests para perfil de empresa
export interface CreatePerfilEmpresaRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface UpdatePerfilEmpresaRequest {
  nomeEmpresa?: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

export interface PerfilEmpresaResponse {
  id: string;
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 🆕 Registro completo de empresa
export interface RegisterEmpresaCompleteRequest {
  userId: string;
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}
```

### **Frontend Types (Expansão)**
```typescript
// ✅ src/modules/auth/types/auth.types.ts
// Adicionar tipos específicos do frontend

export interface EmpresaRegistrationFormData {
  nomeEmpresa: string;
  pessoaContacto?: string;
  morada?: string;
  observacoes?: string;
}

// Re-exportar novos tipos
export type { 
  PerfilEmpresa, 
  CreatePerfilEmpresaRequest, 
  UpdatePerfilEmpresaRequest,
  PerfilEmpresaResponse,
  RegisterEmpresaCompleteRequest 
} from '../../../../shared-types/api.types';
```

---

## 🚀 **PLANO DE IMPLEMENTAÇÃO DETALHADO**

### **📋 FASE 2A: Backend (Empresa)**
**Duração estimada:** 1-2 dias (padrão já estabelecido)

1. **✅ Atualizar Schema Prisma**
   ```bash
   # Adicionar PerfilEmpresa model
   # Adicionar relação ao User model
   npx prisma db push
   npx prisma generate
   ```

2. **✅ Criar Módulo Empresas**
   ```
   backend/src/modules/empresas/
   ├── empresa.controller.ts    # Copiar padrão de imigrante.controller.ts
   ├── empresa.service.ts       # Copiar padrão de imigrante.service.ts
   ├── empresa.routes.ts        # Copiar padrão de imigrante.routes.ts
   └── empresa.types.ts         # Adaptar interfaces específicas
   ```

3. **✅ Implementar CRUD Completo**
   - Service: 6 métodos padrão (create, get, update, delete, list, has)
   - Controller: validações e responses padronizadas
   - Routes: 6 endpoints RESTful

4. **✅ Integrar no App Principal**
   ```typescript
   // backend/src/app.ts
   import { empresaRoutes } from './modules/empresas/empresa.routes';
   app.use('/api/empresas', empresaRoutes);
   ```

5. **✅ Atualizar Types Compartilhados**
   - shared-types/api.types.ts com interfaces de empresa
   - Sincronizar constantes e tipos

### **📋 FASE 2B: Frontend (Empresa)**
**Duração estimada:** 1-2 dias (componentes reutilizáveis)

1. **✅ Atualizar Types Frontend**
   - Importar novos tipos do shared-types
   - Adicionar interfaces específicas do frontend

2. **✅ Criar Página PerfilEmpresa**
   - Copiar estrutura de PerfilImigrante.tsx
   - Adaptar título e componente específico

3. **✅ Criar Componente EmpresaDetails**
   - Copiar estrutura de ImigranteDetails.tsx
   - Adaptar campos e validações específicas
   - Manter padrão de UX (loading, toast, etc.)

4. **✅ Expandir Modal de Registro**
   - Adicionar caso EMPRESA no CategoryRegistrationModal
   - Implementar formulário específico com validação Zod
   - Manter fluxo de 2 etapas

5. **✅ Atualizar Navegação**
   - Expandir menu condicional no MainSidebar
   - Adicionar rota /app/perfil-empresa no App.tsx
   - Ativar card "Empresa" no RegistrationCards

### **📋 FASE 2C: Testes e Validação**
**Duração estimada:** 0.5-1 dia (padrão validado)

1. **✅ Testes de Fluxo Completo**
   - Registro empresa em 2 etapas
   - CRUD de perfil de empresa
   - Navegação condicional dashboard
   - Proteção de categoria (email existente)

2. **✅ Validação UX/UI**
   - Consistência visual com categoria imigrante
   - Responsividade móvel
   - Loading states e feedback

3. **✅ Documentação**
   - Atualizar status na documentação técnica
   - Registrar diferenças específicas da categoria

---

## 🔒 **PROTEÇÃO DE CATEGORIA (Já Implementado)**

### **Email Já Cadastrado - Comportamento Atual**
```typescript
// ✅ Sistema já protege contra duplo cadastro
// Se usuário com email existente tentar se registrar como EMPRESA:

1. **Detecção:** Sistema detecta email já existe
2. **Aviso:** Exibe mensagem "Email já cadastrado na plataforma"
3. **Ação:** Oferece link para fazer login
4. **Login:** Usuário faz login normalmente
5. **Redirecionamento:** Vai para dashboard da categoria original

// 🎯 Resultado: Usuário mantém categoria original, não pode "migrar"
```

### **Vantagens da Abordagem Atual**
- ✅ **Integridade:** Cada usuário permanece em sua categoria
- ✅ **Simplicidade:** Sem lógica complexa de migração de categoria
- ✅ **Segurança:** Impede cadastros duplicados ou conflitantes
- ✅ **UX Clara:** Usuário entende que deve usar categoria original

---

## 💡 **VANTAGENS DA IMPLEMENTAÇÃO FASE 2**

### **🛠️ Reutilização de Código**
- **80% de código reutilizável** da categoria imigrante
- **Padrões validados** para service, controller, componentes
- **Modal expansível** já preparado para múltiplas categorias
- **Navegação condicional** já implementada

### **⚡ Velocidade de Implementação**
- **Backend:** 1-2 dias (vs 3-4 dias da primeira categoria)
- **Frontend:** 1-2 dias (vs 3-4 dias da primeira categoria)  
- **Testes:** 0.5-1 dia (padrões já validados)
- **Total:** 2.5-5 dias vs 6.5-9 dias iniciais

### **🎯 Consistência UX/UI**
- **Fluxo idêntico** ao da categoria imigrante
- **Visual uniforme** mantendo identidade da plataforma
- **Aprendizado zero** para usuários familiares com sistema

### **📈 Escalabilidade Comprovada**
- **Padrão modular** funcionando perfeitamente
- **Base sólida** para categorias 3, 4 e 5
- **Estrutura extensível** sem modificações na base

---

## 📋 **CHECKLIST DE APROVAÇÃO PARA EXECUÇÃO**

### **✅ Estrutura de Dados**
- [ ] Schema PerfilEmpresa com 4 campos específicos aprovado
- [ ] Relação 1:1 com User mantendo padrão estabelecido
- [ ] Campos obrigatórios vs opcionais definidos corretamente

### **✅ Backend Modular**
- [ ] Módulo empresas/ seguindo padrão de imigrantes/ aprovado
- [ ] 6 endpoints RESTful padrão (/api/empresas/perfil) aprovados
- [ ] Reutilização de 80% da lógica existente aprovada

### **✅ Frontend Escalável**
- [ ] Página PerfilEmpresa seguindo layout padrão aprovada
- [ ] Componente EmpresaDetails com formulário específico aprovado
- [ ] Expansão do modal de registro para EMPRESA aprovada
- [ ] Menu condicional "Perfil de Empresa" aprovado

### **✅ Proteção de Categoria**
- [ ] Comportamento atual de email duplicado mantido
- [ ] Não permitir migração entre categorias confirmado
- [ ] Fluxo de login para categoria original aprovado

### **✅ Cronograma**
- [ ] Duração total de 2.5-5 dias aprovada
- [ ] Faseamento Backend → Frontend → Testes aprovado
- [ ] Prioridade da categoria Empresa confirmada

---

## 📞 **PRÓXIMOS PASSOS APÓS APROVAÇÃO**

### **Ordem de Execução:**
1. **🎯 Fase 2A:** Backend empresas/ (1-2 dias)
2. **🎯 Fase 2B:** Frontend empresa (1-2 dias)  
3. **🎯 Fase 2C:** Testes e validação (0.5-1 dia)
4. **📚 Atualização:** Documentação com estado real

### **Preparação para Fase 3:**
- **Escolha da próxima categoria:** Município, Academia ou Família
- **Refinamento do padrão:** Com base na experiência das 2 primeiras
- **Otimização de templates:** Para máxima eficiência

---

**Este plano garante implementação rápida e consistente da categoria Empresa, aproveitando toda a estrutura modular e padrões técnicos estabelecidos na categoria Imigrante, mantendo alta qualidade e escalabilidade para as próximas categorias.**

---

*Plano técnico para Fase 2 - Janeiro 2025*  
*Baseado no sucesso da implementação da categoria Imigrante*  
*Foco em reutilização, consistência e velocidade de implementação* 