import React from 'react';
import { Card, CardBody, CardHeader, Button } from 'shards-react';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[] | string; // Pode ser array ou string JSON
  perguntasModelo?: string;
}

interface Contribuicao {
  id: string;
  userId: string;
  tipoContribuicaoId: string;
  descricao: string;
  tags: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  tipoContribuicao: TipoContribuicao;
}

interface ContribuicaoCardProps {
  contribuicao: Contribuicao;
  onEdit: (contribuicao: Contribuicao) => void;
  onDelete: (id: string, descricao: string) => void;
  showActions?: boolean;
}

const ContribuicaoCard: React.FC<ContribuicaoCardProps> = ({
  contribuicao,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-100">
      <CardHeader className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="mb-1">{contribuicao.tipoContribuicao?.titulo}</h6>
          <small className="text-muted">
            {formatDate(contribuicao.createdAt)}
          </small>
        </div>
        <span className={`badge badge-${contribuicao.ativo ? 'success' : 'secondary'}`}>
          {contribuicao.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </CardHeader>
      <CardBody className="d-flex flex-column">
        <p className="text-muted mb-3 flex-grow-1">
          {contribuicao.descricao.length > 150 
            ? `${contribuicao.descricao.substring(0, 150)}...`
            : contribuicao.descricao
          }
        </p>
        
        {contribuicao.tags && contribuicao.tags.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1"><strong>Tags:</strong></small>
            <div>
              {contribuicao.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge badge-light mr-1 mb-1">
                  {tag}
                </span>
              ))}
              {contribuicao.tags.length > 3 && (
                <span className="badge badge-secondary">
                  +{contribuicao.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {showActions && (
          <div className="d-flex justify-content-end mt-auto">
            <Button
              size="sm"
              theme="outline-primary"
              className="mr-2"
              onClick={() => onEdit(contribuicao)}
            >
              <i className="material-icons" style={{fontSize: '16px'}}>edit</i>
            </Button>
            <Button
              size="sm"
              theme="outline-danger"
              onClick={() => onDelete(contribuicao.id, contribuicao.descricao)}
            >
              <i className="material-icons" style={{fontSize: '16px'}}>delete</i>
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ContribuicaoCard;
