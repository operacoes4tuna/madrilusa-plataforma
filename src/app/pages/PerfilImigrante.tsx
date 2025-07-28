import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import UserDetails from '../components/user-profile/UserDetails';
import ImigranteDetails from '../components/user-profile/ImigranteDetails';

const PerfilImigrante: React.FC = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Perfil de Imigrante" 
          subtitle="Gestão do seu perfil específico" 
          md="12" 
          className="ml-sm-auto mr-sm-auto" 
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails />
        </Col>
        <Col lg="8">
          <ImigranteDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilImigrante; 