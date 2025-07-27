import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { User, LogOut, Home } from 'lucide-react';
import '../styles/app-theme.css';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/app/dashboard',
    },
    {
      icon: User,
      label: 'Editar Perfil',
      path: '/app/profile',
    },
  ];

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img
            src="/logo_madrilusa/logo madrilusa.png"
            alt="Madrilusa"
            className="h-8 w-auto"
          />
          <span className="text-xl font-semibold" style={{ color: 'var(--app-primary)' }}>
            Portal Madrilusa
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Olá, <span className="font-medium" style={{ color: 'var(--app-foreground)' }}>
              {user?.nomeCompleto}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="app-sidebar">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Menu Principal
            </h3>
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`app-sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 