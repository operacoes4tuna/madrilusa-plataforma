# 🛡️ INTERFACE DE ADMINISTRAÇÃO - MADRILUSA

**Data:** Janeiro 2025  
**Status:** ✅ **PROPOSTA TÉCNICA COMPLETA**  
**Prioridade:** Alta  
**Impacto:** Baixo (extensão da estrutura existente)  
**Tempo Estimado:** 2-3 horas de implementação

---

## 📋 **VISÃO GERAL**

### **Contexto**
A plataforma Madrilusa necessita de uma interface administrativa simples para acompanhar totalizadores de usuários registrados e gerir informações básicas dos mesmos. A proposta é criar uma solução que reutilize 100% da estrutura existente.

### **Objetivo Principal**
Implementar uma categoria **ADMIN** que permita:
1. **Dashboard quantitativo** com totalizadores por categoria
2. **Gestão básica de usuários** com filtros e visualização detalhada
3. **Acesso controlado** através de credenciais específicas

### **Estratégia Escolhida**
Aproveitar a arquitetura modular existente, criando uma nova categoria que segue exatamente o mesmo padrão das 5 categorias já implementadas (Imigrante, Empresa, Município, Academia, Família).

---

## 🏗️ **ARQUITETURA TÉCNICA**

### **Extensão do Sistema de Categorias**
A implementação seguirá a **Metodologia Categoria Universal** já documentada, garantindo consistência com o sistema existente.

#### **Modificações em Tipos Compartilhados**
```typescript
// shared-types/api.types.ts
export const USER_CATEGORIES = {
  IMIGRANTE: 'IMIGRANTE',
  EMPRESA: 'EMPRESA', 
  MUNICIPIO: 'MUNICIPIO',
  ACADEMIA: 'ACADEMIA',
  FAMILIA_ACOLHIMENTO: 'FAMILIA_ACOLHIMENTO',
  ADMIN: 'ADMIN' // ✨ NOVA CATEGORIA
} as const;
```

#### **Credenciais de Acesso Definidas**
- **Email:** admin@madrilusa.com
- **Senha:** madrilusa1234tuna
- **Categoria:** ADMIN

---

## 💾 **IMPLEMENTAÇÃO BACKEND**

### **1. Módulo Admin (Novo)**
```
backend/src/modules/admin/
├── admin.controller.ts   # Endpoints para dashboard e gestão
├── admin.service.ts      # Lógica de negócio admin
├── admin.routes.ts       # Rotas específicas admin
└── admin.types.ts        # Interfaces para responses admin
```

### **2. Endpoints Administrativos**
```typescript
// Rotas principais
GET  /api/admin/stats              # Totalizadores dashboard
GET  /api/admin/users              # Lista todos usuários
GET  /api/admin/users/:categoria   # Filtrar por categoria
GET  /api/admin/user/:id/complete  # Usuário com todos os perfis
PUT  /api/admin/user/:id           # Editar usuário (dados básicos)
DELETE /api/admin/user/:id         # Remover usuário
```

### **3. Service Admin - Funcionalidades**
```typescript
export class AdminService {
  // Dashboard Stats
  async getAdminStats() {
    return {
      totalUsers: await prisma.user.count(),
      usersByCategory: await this.getUserCountByCategory(),
      recentUsers: await this.getRecentUsersCount(),
      profilesCompleted: await this.getProfilesCompletedCount()
    };
  }

  // Gestão de Usuários
  async getAllUsersWithProfiles() {
    return await prisma.user.findMany({
      include: {
        perfilImigrante: true,
        perfilEmpresa: true,
        perfilMunicipio: true,
        perfilAcademia: true,
        perfilFamilia: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Contadores por categoria
  async getUserCountByCategory() {
    const counts = await prisma.user.groupBy({
      by: ['categoria'],
      _count: { categoria: true }
    });
    return this.formatCategoryCounts(counts);
  }

  // Usuários recentes (últimos 7 dias)
  async getRecentUsersCount() {
    return await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
  }
}
```

### **4. Criação Automática do Usuário Admin**
```typescript
// backend/prisma/seed.ts (novo arquivo)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('Criando usuário administrador...');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@madrilusa.com' },
    update: {
      senha: 'madrilusa1234tuna',
      categoria: 'ADMIN'
    },
    create: {
      nomeCompleto: 'Administrador Madrilusa',
      email: 'admin@madrilusa.com',
      senha: 'madrilusa1234tuna',
      categoria: 'ADMIN',
      telemovel: null,
      foto: null
    }
  });

  console.log('Usuário admin criado:', adminUser.email);
}

async function main() {
  await createAdminUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🎨 **IMPLEMENTAÇÃO FRONTEND**

### **1. Páginas Admin (Novas)**
```
src/app/pages/
├── AdminDashboard.tsx        # Dashboard com totalizadores
├── UserManagement.tsx        # Gestão de usuários
└── UserDetails.tsx           # Detalhes completos de usuário
```

### **2. AdminDashboard.tsx - Reutiliza SmallStats**
```typescript
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import SmallStats from '../components/common/SmallStats';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  const adminStats = [
    {
      label: "Total de Usuários",
      value: stats?.totalUsers || 0,
      percentage: "Registrados",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Imigrantes",
      value: stats?.usersByCategory?.IMIGRANTE || 0,
      percentage: "Perfis",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Empresas",
      value: stats?.usersByCategory?.EMPRESA || 0,
      percentage: "Ativas",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Municípios",
      value: stats?.usersByCategory?.MUNICIPIO || 0,
      percentage: "Parceiros",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Academias",
      value: stats?.usersByCategory?.ACADEMIA || 0,
      percentage: "Formação",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Famílias",
      value: stats?.usersByCategory?.FAMILIA_ACOLHIMENTO || 0,
      percentage: "Acolhimento",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Novos (7 dias)",
      value: stats?.recentUsers || 0,
      percentage: "Recentes",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Perfis Completos",
      value: stats?.profilesCompleted || 0,
      percentage: "Finalizados",
      increase: true,
      attrs: { md: "6", sm: "6" }
    }
  ];

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Dashboard Administrativo" 
          subtitle="Visão Geral da Plataforma" 
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Small Stats Blocks - REUTILIZA COMPONENTE EXISTENTE */}
      <Row>
        {adminStats.map((stat, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stat.attrs}>
            <SmallStats
              id={`admin-stats-${idx}`}
              variation="1"
              label={stat.label}
              value={stat.value}
              percentage={stat.percentage}
              increase={stat.increase}
            />
          </Col>
        ))}
      </Row>

      {/* Summary Cards */}
      <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Resumo da Plataforma</h6>
            </div>
            <div className="card-body">
              <h4 className="mb-3" style={{ color: '#F5A623' }}>
                Plataforma Madrilusa - Painel Administrativo
              </h4>
              <p className="text-muted mb-4">
                Gerencie usuários registrados, acompanhe estatísticas e mantenha 
                a plataforma funcionando de forma otimizada.
              </p>
              
              <div className="bg-light border rounded p-3">
                <h6 className="mb-2" style={{ color: '#4A90A4' }}>Ações Disponíveis</h6>
                <ul className="mb-0 text-muted small">
                  <li>Visualizar totalizadores por categoria de usuário</li>
                  <li>Gerir informações de usuários registrados</li>
                  <li>Filtrar e buscar perfis específicos</li>
                  <li>Editar ou remover contas conforme necessário</li>
                </ul>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Ações Rápidas</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <a href="/app/user-management" className="btn btn-primary btn-sm btn-block">
                  <i className="material-icons mr-1">group</i>
                  Gerir Usuários
                </a>
              </div>
              
              <div className="mb-3">
                <button className="btn btn-outline-primary btn-sm btn-block" onClick={() => window.location.reload()}>
                  <i className="material-icons mr-1">refresh</i>
                  Atualizar Dados
                </button>
              </div>
              
              <div>
                <a href="/app/profile" className="btn btn-outline-secondary btn-sm btn-block">
                  <i className="material-icons mr-1">person</i>
                  Meu Perfil
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
```

### **3. UserManagement.tsx - Lista com Filtros**
```typescript
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'shards-react';
import PageTitle from '../components/common/PageTitle';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (filter === 'ALL') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.categoria === filter));
    }
  };

  const getCategoryBadgeColor = (categoria: string) => {
    const colors = {
      'IMIGRANTE': 'badge-success',
      'EMPRESA': 'badge-primary', 
      'MUNICIPIO': 'badge-warning',
      'ACADEMIA': 'badge-info',
      'FAMILIA_ACOLHIMENTO': 'badge-secondary',
      'ADMIN': 'badge-danger'
    };
    return colors[categoria] || 'badge-light';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div>Carregando usuários...</div>;

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Gestão de Usuários" 
          subtitle={`${filteredUsers.length} usuários encontrados`}
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <div className="card small">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label htmlFor="categoryFilter" className="form-label">
                    <strong>Filtrar por Categoria:</strong>
                  </label>
                  <select 
                    id="categoryFilter"
                    className="form-control"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">Todas as Categorias ({users.length})</option>
                    <option value="IMIGRANTE">
                      Imigrantes ({users.filter(u => u.categoria === 'IMIGRANTE').length})
                    </option>
                    <option value="EMPRESA">
                      Empresas ({users.filter(u => u.categoria === 'EMPRESA').length})
                    </option>
                    <option value="MUNICIPIO">
                      Municípios ({users.filter(u => u.categoria === 'MUNICIPIO').length})
                    </option>
                    <option value="ACADEMIA">
                      Academias ({users.filter(u => u.categoria === 'ACADEMIA').length})
                    </option>
                    <option value="FAMILIA_ACOLHIMENTO">
                      Famílias ({users.filter(u => u.categoria === 'FAMILIA_ACOLHIMENTO').length})
                    </option>
                    <option value="ADMIN">
                      Administradores ({users.filter(u => u.categoria === 'ADMIN').length})
                    </option>
                  </select>
                </div>
                <div className="col-md-6 text-right">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    <i className="material-icons mr-1">refresh</i>
                    Atualizar Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Lista de Usuários */}
      <Row>
        {filteredUsers.map(user => (
          <Col md="6" lg="4" className="mb-4" key={user.id}>
            <div className="card small">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{user.nomeCompleto}</h6>
                  <span className={`badge ${getCategoryBadgeColor(user.categoria)}`}>
                    {user.categoria}
                  </span>
                </div>
                
                <p className="text-muted mb-1 small">
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>email</i>
                  {user.email}
                </p>
                
                {user.telemovel && (
                  <p className="text-muted mb-1 small">
                    <i className="material-icons mr-1" style={{fontSize: '14px'}}>phone</i>
                    {user.telemovel}
                  </p>
                )}
                
                <p className="text-muted mb-3 small">
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>calendar_today</i>
                  Membro desde {formatDate(user.createdAt)}
                </p>
                
                <div className="btn-group btn-group-sm w-100">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setSelectedUser(user)}
                  >
                    <i className="material-icons">visibility</i>
                    Ver Detalhes
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => {/* Implementar edição */}}
                  >
                    <i className="material-icons">edit</i>
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Mensagem quando não há usuários */}
      {filteredUsers.length === 0 && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                person_off
              </i>
              <h5 className="mt-3 text-muted">
                Nenhum usuário encontrado
              </h5>
              <p className="text-muted">
                Não há usuários registrados para o filtro selecionado.
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Modal de Detalhes do Usuário (implementação futura) */}
      {selectedUser && (
        <div className="modal fade show" style={{display: 'block'}} onClick={() => setSelectedUser(null)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Usuário</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(selectedUser, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserManagement;
```

### **4. Navegação Admin - Extensão do MainSidebar**
```typescript
// src/app/components/layout/MainSidebar.tsx
// Adicionar estas linhas no código existente:

// Menu específico para ADMIN
if (user?.categoria === USER_CATEGORIES.ADMIN) {
  categoryMenuItems.push(
    {
      title: 'Dashboard Admin',
      to: '/app/admin-dashboard',
      iconClass: 'admin_panel_settings',
      htmlAfter: ''
    },
    {
      title: 'Gestão de Usuários',
      to: '/app/user-management',
      iconClass: 'group',
      htmlAfter: ''
    }
  );
}
```

### **5. Rotas Admin - Extensão do App.tsx**
```typescript
// src/App.tsx - Adicionar rotas
import AdminDashboard from "./app/pages/AdminDashboard";
import UserManagement from "./app/pages/UserManagement";

// Dentro do Route path="/app":
<Route path="admin-dashboard" element={<AdminDashboard />} />
<Route path="user-management" element={<UserManagement />} />
```

---

## 🔐 **SEGURANÇA E CONTROLE DE ACESSO**

### **1. Middleware de Autorização (Backend)**
```typescript
// backend/src/shared/middleware/adminAuth.ts
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user; // Assumindo middleware de autenticação anterior
  
  if (!user || user.categoria !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado - Permissões de administrador necessárias'
    });
  }
  
  next();
};
```

### **2. Proteção de Rotas (Frontend)**
```typescript
// src/components/AdminRoute.tsx
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.categoria !== 'ADMIN') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Uso nas rotas:
<Route path="admin-dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

---

## 📊 **DADOS E MÉTRICAS**

### **Totalizadores Disponíveis**
1. **Total de usuários** registrados na plataforma
2. **Usuários por categoria** (Imigrante, Empresa, etc.)
3. **Novos registros** (últimos 7 dias)
4. **Perfis completos** (usuários com dados específicos preenchidos)
5. **Contas ativas** vs. inativas
6. **Registros por mês** (crescimento)

### **Funcionalidades de Gestão**
1. **Visualizar todos os usuários** com informações básicas
2. **Filtrar por categoria** específica
3. **Ver detalhes completos** incluindo perfis específicos
4. **Editar dados básicos** (nome, email, telefone)
5. **Remover usuários** (com confirmação)
6. **Buscar por nome/email** (implementação futura)

---

## ⚡ **CRONOGRAMA DE IMPLEMENTAÇÃO**

### **Fase 1: Backend (1 hora)**
```
✅ Tarefa 1.1: Atualizar USER_CATEGORIES (5 min)
✅ Tarefa 1.2: Criar módulo admin/ (15 min)
✅ Tarefa 1.3: Implementar AdminService (20 min)
✅ Tarefa 1.4: Criar endpoints admin (15 min)
✅ Tarefa 1.5: Script seed usuário admin (5 min)
```

### **Fase 2: Frontend (1.5 horas)**
```
✅ Tarefa 2.1: AdminDashboard.tsx (30 min)
✅ Tarefa 2.2: UserManagement.tsx (45 min)
✅ Tarefa 2.3: Atualizar MainSidebar (10 min)
✅ Tarefa 2.4: Novas rotas App.tsx (5 min)
```

### **Fase 3: Testes e Validação (30 minutos)**
```
✅ Tarefa 3.1: Criar usuário admin (5 min)
✅ Tarefa 3.2: Testar login admin (5 min)
✅ Tarefa 3.3: Verificar dashboard stats (10 min)
✅ Tarefa 3.4: Testar gestão usuários (10 min)
```

**Total: 3 horas de implementação**

---

## 🎯 **RESULTADO ESPERADO**

### **Interface Administrativa Funcional**
- **Login**: admin@madrilusa.com / madrilusa1234tuna
- **Dashboard**: Totalizadores quantitativos por categoria
- **Gestão**: Lista filtrable de todos os usuários
- **Navegação**: Menus específicos apenas para admin
- **Segurança**: Acesso controlado e rotas protegidas

### **Funcionalidades Entregues**
1. ✅ Dashboard com 8 métricas principais
2. ✅ Lista de usuários com filtros por categoria
3. ✅ Visualização detalhada de perfis completos
4. ✅ Interface consistente com design Madrilusa
5. ✅ Navegação condicional (só admin vê menus admin)

---

## 📋 **CHECKLIST DE QUALIDADE**

### **Backend**
- [ ] Categoria ADMIN adicionada aos tipos
- [ ] Módulo admin/ criado com service/controller/routes
- [ ] Endpoints /admin/* funcionais e testados
- [ ] Middleware de autorização implementado
- [ ] Usuário admin criado automaticamente via seed

### **Frontend**  
- [ ] AdminDashboard.tsx criado e funcional
- [ ] UserManagement.tsx criado com filtros
- [ ] MainSidebar atualizado para categoria ADMIN
- [ ] Rotas admin adicionadas em App.tsx
- [ ] Proteção de rotas implementada

### **Funcionalidades**
- [ ] Login com credenciais admin funciona
- [ ] Dashboard exibe totalizadores corretos
- [ ] Lista de usuários carrega e filtra
- [ ] Navegação admin aparece apenas para admin
- [ ] Interface segue padrão visual Madrilusa

---

## 🔮 **EXPANSÕES FUTURAS**

### **Funcionalidades Avançadas (Fase 2)**
- **Busca textual** por nome/email nos usuários
- **Edição inline** de dados básicos
- **Logs de atividade** administrativa
- **Exportação** de dados em CSV/Excel
- **Notificações** para administradores

### **Métricas Avançadas (Fase 3)**
- **Gráficos temporais** de crescimento
- **Análise de engagement** por categoria
- **Relatórios** personalizados
- **Dashboard em tempo real** com WebSockets

### **Segurança Aprimorada (Fase 4)**
- **Autenticação dois fatores** para admin
- **Logs de auditoria** completos
- **Permissões granulares** (super-admin, moderador)
- **Sessões administrativas** com timeout

---

## 📞 **VALIDAÇÃO NECESSÁRIA**

### **Questões para Confirmação**
1. ✅ A abordagem de categoria ADMIN está adequada?
2. ✅ As funcionalidades propostas atendem às necessidades?
3. ✅ O cronograma de 3 horas é aceitável?
4. ✅ As credenciais definidas são apropriadas?
5. ✅ Alguma funcionalidade adicional é prioritária?

### **Próximos Passos**
- **Aprovação** da proposta técnica
- **Implementação** seguindo cronograma definido
- **Testes** de todas as funcionalidades
- **Documentação** do sistema admin no status

---

**🛡️ PROPOSTA TÉCNICA COMPLETA - INTERFACE ADMINISTRAÇÃO**  
*Extensão modular da arquitetura existente*  
*Implementação: 3 horas | Funcionalidades: Dashboard + Gestão*  
*Zero impacto nas funcionalidades atuais* 