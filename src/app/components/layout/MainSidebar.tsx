import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink } from 'shards-react';
import classNames from 'classnames';

import SidebarMainNavbar from './SidebarMainNavbar';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { USER_CATEGORIES } from '@/modules/auth/types/auth.types';

const MainSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();

  // Itens de navegação base
  const baseSidebarNavItems = [
    {
      title: 'Site Madrilusa',
      to: '/',
      iconClass: 'public',
      htmlAfter: ''
    },
    {
      title: 'Dashboard',
      to: '/app/dashboard',
      iconClass: 'dashboard',
      htmlAfter: ''
    },
    {
      title: 'Perfil do Utilizador',
      to: '/app/profile', 
      iconClass: 'person',
      htmlAfter: ''
    }
  ];

  // Menu específico por categoria
  const categoryMenuItems = [];
  
  if (user?.categoria === USER_CATEGORIES.IMIGRANTE) {
    categoryMenuItems.push({
      title: 'Perfil de Imigrante',
      to: '/app/perfil-imigrante',
      iconClass: 'language',
      htmlAfter: ''
    });
  }
  
  if (user?.categoria === USER_CATEGORIES.EMPRESA) {
    categoryMenuItems.push({
      title: 'Perfil de Empresa',
      to: '/app/perfil-empresa',
      iconClass: 'business',
      htmlAfter: ''
    });
  }
  
  // Combinar menus
  const sidebarNavItems = [...baseSidebarNavItems, ...categoryMenuItems];

  const classes = classNames(
    'main-sidebar',
    'px-0',
    'col-12',
    menuVisible && 'open'
  );

  return (
    <Col
      tag="aside"
      className={classes}
      lg={{ size: 2 }}
      md={{ size: 3 }}
    >
      <SidebarMainNavbar />
      
      {/* Navigation Items */}
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {sidebarNavItems.map((item, idx) => (
            <NavItem key={idx}>
              <NavLink
                tag="a"
                className={classNames(
                  location.pathname === item.to && 'active'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.to);
                }}
                href={item.to}
              >
                <span className="sidebar-nav-item-icon">
                  <i className="material-icons">{item.iconClass}</i>
                </span>
                <span>{item.title}</span>
                {item.htmlAfter && (
                  <span 
                    className="sidebar-nav-item-badge"
                    dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
                  />
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        
        {/* Barra de Logos Institucional */}
        <div className="sidebar-logos" style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '10px',
          width: 'calc(16.66667% - 20px)',
          textAlign: 'center',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/logo_madrilusa/barradelogosmadrilusa.png"
            alt="Parceiros Madrilusa"
            style={{ 
              width: '95%', 
              height: 'auto',
              maxWidth: '280px'
            }}
          />
        </div>
      </div>
    </Col>
  );
};

export default MainSidebar; 