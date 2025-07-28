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
          <UserDetails />
        </Col>
        <Col lg="8">
          <EmpresaDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilEmpresa; 