import React from 'react';
import { Row, Col } from 'shards-react';
import ContribuicaoCard from './ContribuicaoCard';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  contextoIA?: string;
  textoModelo?: string;
  tagsModelo?: string[];
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

interface ContribuicoesListProps {
  contribuicoes: Contribuicao[];
  onEdit: (contribuicao: Contribuicao) => void;
  onDelete: (id: string, descricao: string) => void;
  loading?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}

const ContribuicoesList: React.FC<ContribuicoesListProps> = ({
  contribuicoes,
  onEdit,
  onDelete,
  loading = false,
  showActions = true,
  emptyMessage = "Nenhuma contribuição encontrada",
  emptyIcon = "assignment"
}) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    );
  }

  if (contribuicoes.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="material-icons" style={{fontSize: '64px', color: '#ccc'}}>
          {emptyIcon}
        </i>
        <h5 className="mt-3 text-muted">
          {emptyMessage}
        </h5>
      </div>
    );
  }

  return (
    <Row>
      {contribuicoes.map(contribuicao => (
        <Col md={6} lg={4} className="mb-4" key={contribuicao.id}>
          <ContribuicaoCard
            contribuicao={contribuicao}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ContribuicoesList;
