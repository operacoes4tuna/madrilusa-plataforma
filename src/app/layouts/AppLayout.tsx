import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'shards-react';

import MainSidebar from '../components/layout/MainSidebar';
import MainNavbar from '../components/layout/MainNavbar';
import MainFooter from '../components/layout/MainFooter';

// Importar estilos do Shards para aplicação
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/shards-app.css';
import '../styles/navbar-custom.css';

const AppLayout: React.FC = () => {
  return (
    <>
      {/* Material Icons Font */}
      <link 
        href="https://fonts.googleapis.com/icon?family=Material+Icons" 
        rel="stylesheet" 
      />
      
      <Container fluid>
        <Row>
          <MainSidebar />
          <Col
            className="main-content p-0"
            lg={{ size: 10, offset: 2 }}
            md={{ size: 9, offset: 3 }}
            sm="12"
            tag="main"
          >
            <MainNavbar />
            <Outlet />
            <MainFooter />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AppLayout; 