import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import UserDetails from '../components/user-profile/UserDetails';
import FamiliaDetails from '../components/user-profile/FamiliaDetails';

const PerfilFamilia: React.FC = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Perfil de Família" 
          subtitle="Gestão do seu perfil de acolhimento familiar" 
          md="12" 
          className="ml-sm-auto mr-sm-auto" 
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails />
        </Col>
        <Col lg="8">
          <FamiliaDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilFamilia; 