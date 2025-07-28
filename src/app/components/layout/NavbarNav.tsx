import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, NavItem } from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getUserPhotoUrl } from '@/lib/userPhotoUtils';

const NavbarNav: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/app/profile');
    setDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/app/dashboard');
    setDropdownOpen(false);
  };

  // Fechar dropdown quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.navbar-user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);



  return (
    <Nav navbar className="flex-row ml-auto">
      {/* Notifications - placeholder for future */}
      <NavItem className="border-right dropdown">
        <div className="nav-link" style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}>
          <div className="d-flex align-items-center position-relative">
            <i className="material-icons" style={{ fontSize: '28px' }}>notifications</i>
            <span className="indicator"></span>
          </div>
        </div>
      </NavItem>

      {/* User Avatar Dropdown - Custom Implementation */}
      <NavItem className="navbar-user-dropdown position-relative">
        <div 
          className="nav-link dropdown-toggle-custom"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ cursor: 'pointer', minHeight: '80px', display: 'flex', alignItems: 'center' }}
        >
          <div className="d-flex align-items-center">
            <img
              className="user-avatar rounded-circle mr-2"
              src={getUserPhotoUrl(user)}
              alt={user?.nomeCompleto || 'User'}
              style={{ 
                width: '40px', 
                height: '40px',
                border: user?.foto ? '2px solid #F5A623' : '2px solid #e3ebf0',
                objectFit: 'cover'
              }}
            />
            <span className="d-none d-md-inline-block mr-1" style={{ fontSize: '16px', fontWeight: '500' }}>
              {user?.nomeCompleto || 'Utilizador'}
            </span>
            <i className="material-icons" style={{ fontSize: '24px' }}>
              {dropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </i>
          </div>
        </div>
        
        {/* Dropdown Menu Custom */}
        <div className={`dropdown-menu-custom ${dropdownOpen ? 'show' : ''}`}>
          <div className="dropdown-item-custom" onClick={handleDashboardClick}>
            <i className="material-icons mr-2" style={{ fontSize: '20px' }}>dashboard</i> 
            Minha Plataforma
          </div>
          <div className="dropdown-item-custom" onClick={handleProfileClick}>
            <i className="material-icons mr-2" style={{ fontSize: '20px' }}>edit</i> 
            Editar Perfil
          </div>
          <div className="dropdown-divider-custom"></div>
          <div className="dropdown-item-custom" onClick={handleLogout}>
            <i className="material-icons text-danger mr-2" style={{ fontSize: '20px' }}>exit_to_app</i> 
            Sair
          </div>
        </div>
      </NavItem>
    </Nav>
  );
};

export default NavbarNav; 