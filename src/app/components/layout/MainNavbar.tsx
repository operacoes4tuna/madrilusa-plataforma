import React from 'react';
import { Container, Navbar } from 'shards-react';
import classNames from 'classnames';

import NavbarNav from './NavbarNav';
import NavbarToggle from './NavbarToggle';

interface MainNavbarProps {
  layout?: string;
  stickyTop?: boolean;
}

const MainNavbar: React.FC<MainNavbarProps> = ({
  layout,
  stickyTop = true
}) => {
  const classes = classNames(
    'main-navbar',
    'bg-white',
    'border-bottom',
    stickyTop && 'sticky-top'
  );

  return (
    <div className={classes}>
      <Container fluid className="p-0">
        <Navbar
          type="light"
          className="align-items-stretch flex-md-nowrap p-0"
          style={{ minHeight: '80px' }}
        >
          <NavbarNav />
          <NavbarToggle />
        </Navbar>
      </Container>
    </div>
  );
};

export default MainNavbar; 