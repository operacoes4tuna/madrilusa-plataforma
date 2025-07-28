import React from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink } from 'shards-react';

const MainFooter: React.FC = () => {
  return (
    <footer className="main-footer d-flex p-2 px-3 bg-white border-top">
      <Container fluid>
        <Row>
          <Col>
            <Nav>
              <NavItem>
                <NavLink tag="a" href="#">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="a" href="#">
                  Serviços
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="a" href="#">
                  Sobre
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="a" href="#">
                  Produtos
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="a" href="#">
                  Blog
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col className="text-right">
            <p className="text-muted mb-0">
              Copyright © 2025 Madrilusa
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MainFooter; 