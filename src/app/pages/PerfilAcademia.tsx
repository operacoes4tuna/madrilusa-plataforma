import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import UserDetails from '../components/user-profile/UserDetails';
import AcademiaDetails from '../components/user-profile/AcademiaDetails';

const PerfilAcademia: React.FC = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Perfil de Academia" 
          subtitle="Gestão do seu perfil académico institucional" 
          md="12" 
          className="ml-sm-auto mr-sm-auto" 
        />
      </Row>
      <Row>
        <Col lg="4">
          <UserDetails />
        </Col>
        <Col lg="8">
          <AcademiaDetails />
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilAcademia; 