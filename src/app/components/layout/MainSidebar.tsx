import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink } from 'shards-react';
import classNames from 'classnames';

import SidebarMainNavbar from './SidebarMainNavbar';

const MainSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  // Itens de navegação seguindo padrão do Shards original
  const sidebarNavItems = [
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
      </div>
    </Col>
  );
};

export default MainSidebar; 