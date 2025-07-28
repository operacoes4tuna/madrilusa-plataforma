import React from 'react';
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getUserPhotoUrl } from '@/lib/userPhotoUtils';

const UserDetails: React.FC = () => {
  const { user } = useAuth();

  // Dados do utilizador com valores padrão seguindo padrão original
  const userDetails = {
    name: user?.nomeCompleto || "Utilizador Madrilusa",
    avatar: getUserPhotoUrl(user),
    jobTitle: "Membro da Comunidade",
    performanceReportTitle: "Perfil Completo",
    performanceReportValue: 85
  };

  return (
    <Card small className="mb-4 pt-3">
      <CardHeader className="border-bottom text-center">
        <div className="mb-3 mx-auto d-flex justify-content-center">
          <img
            className="rounded-circle"
            src={userDetails.avatar}
            alt={userDetails.name}
            width="110"
            style={{
              height: '110px',
              objectFit: 'cover',
              border: user?.foto ? '3px solid #F5A623' : 'none',
              display: 'block'
            }}
          />
        </div>
        <h4 className="mb-0">{userDetails.name}</h4>
        <span className="text-muted d-block mb-3">{userDetails.jobTitle}</span>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="px-4">
          <div className="progress-wrapper">
            <strong className="text-muted d-block mb-2">
              {userDetails.performanceReportTitle}
            </strong>
            <Progress
              className="progress-sm"
              value={userDetails.performanceReportValue}
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div
                className="progress-bar"
                style={{
                  backgroundColor: '#F5A623',
                  width: `${userDetails.performanceReportValue}%`
                }}
              />
            </Progress>
            <span className="progress-value small text-muted">
              {userDetails.performanceReportValue}%
            </span>
          </div>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default UserDetails; 