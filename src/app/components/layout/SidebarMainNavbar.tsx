import React from 'react';
import { Navbar, NavbarBrand } from 'shards-react';
import classNames from 'classnames';

interface SidebarMainNavbarProps {
  hideLogoText?: boolean;
}

const SidebarMainNavbar: React.FC<SidebarMainNavbarProps> = ({ hideLogoText = false }) => {
  const classes = classNames(
    'main-navbar',
    'align-items-stretch',
    'bg-white',
    'flex-md-nowrap',
    'border-bottom',
    'p-0'
  );

  return (
    <div className={classes} style={{ minHeight: '80px' }}>
      <Navbar className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0" type="light" style={{ minHeight: '80px' }}>
        <NavbarBrand
          className="w-100 mr-0"
          href="/app/dashboard"
          style={{ lineHeight: '60px', minHeight: '80px', display: 'flex', alignItems: 'center' }}
        >
          <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <img
              id="main-logo"
              className="d-inline-block align-top"
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
              src="/logo_madrilusa/logo madrilusa.png"
              alt="Madrilusa"
            />
          </div>
        </NavbarBrand>
        {/* Sidebar Toggle for Mobile */}
        <div className="toggle-sidebar d-sm-inline d-md-none d-lg-none">
          <i className="material-icons" style={{ fontSize: '28px' }}>&#xE5D2;</i>
        </div>
      </Navbar>
    </div>
  );
};

export default SidebarMainNavbar; 