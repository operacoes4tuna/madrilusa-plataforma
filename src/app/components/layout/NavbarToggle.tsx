import React from 'react';
import { NavItem, NavLink } from 'shards-react';

const NavbarToggle: React.FC = () => {
  return (
    <NavItem className="border-right dropdown d-flex d-md-none">
      <NavLink 
        tag="a" 
        className="main-navbar__toggle nav-link"
        href="#"
        style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}
        onClick={(e) => {
          e.preventDefault();
          // Toggle sidebar em mobile
          const sidebar = document.querySelector('.main-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('open');
          }
        }}
      >
        <i className="material-icons" style={{ fontSize: '28px' }}>menu</i>
      </NavLink>
    </NavItem>
  );
};

export default NavbarToggle; 