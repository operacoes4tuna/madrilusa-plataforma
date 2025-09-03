import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button, Badge } from 'shards-react';
import type { 
  ContribuicaoUnificada, 
  DadosExperiencia, 
  DadosFormacao, 
  DadosIdioma 
} from '../../../types/dados-profissionais.types';

interface ContribuicaoCardUnificadoProps {
  contribuicao: ContribuicaoUnificada;
  onEdit: (contribuicao: ContribuicaoUnificada) => void;
  onDelete: (id: string, titulo: string) => void;
  showActions?: boolean;
}

const ContribuicaoCardUnificado: React.FC<ContribuicaoCardUnificadoProps> = ({ 
  contribuicao, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'contribuicao_normal':
        return 'lightbulb_outline';
      case 'experiencia':
        return 'work';
      case 'formacao':
        return 'school';
      case 'idioma':
        return 'language';
      default:
        return 'assignment';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'contribuicao_normal':
        return '#4A90A4'; // Azul Madrilusa
      case 'experiencia':
        return '#28a745'; // Verde
      case 'formacao':
        return '#F5A623'; // Laranja Madrilusa
      case 'idioma':
        return '#6f42c1'; // Roxo
      default:
        return '#6c757d';
    }
  };

  const getBadgeVariant = (nivel: string) => {
    switch (nivel) {
      case 'Básico':
        return 'secondary';
      case 'Intermédio':
        return 'warning';
      case 'Avançado':
        return 'success';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    switch (contribuicao.tipo) {
      case 'contribuicao_normal':
        return (
          <div>
            <p className="mb-2">{contribuicao.descricao}</p>
            <div className="tags">
              {contribuicao.tags.map((tag, index) => (
                <Badge key={index} theme="light" className="mr-1 mb-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        );
        
      case 'experiencia':
        const exp = contribuicao.dadosEstruturados as DadosExperiencia;
        return (
          <div>
            <div className="mb-2">
              <strong className="d-block">{exp.cargo}</strong>
              <span className="text-muted">{exp.empresa}</span>
            </div>
            <div>
              <Badge theme="info" className="mb-1">
                <i className="material-icons mr-1" style={{ fontSize: '14px' }}>schedule</i>
                {exp.tempoNoCargo}
              </Badge>
            </div>
          </div>
        );
        
      case 'formacao':
        const form = contribuicao.dadosEstruturados as DadosFormacao;
        return (
          <div>
            <div className="mb-2">
              <strong className="d-block">{form.curso || form.nivelEscolaridade}</strong>
              {form.instituicao && (
                <span className="text-muted">{form.instituicao}</span>
              )}
            </div>
            <div>
              <Badge theme="warning" className="mb-1">
                {form.nivelEscolaridade}
              </Badge>
              {form.dataTermino && (
                <div className="mt-1">
                  <small className="text-muted">
                    <i className="material-icons mr-1" style={{ fontSize: '12px' }}>event</i>
                    Concluído: {formatDate(form.dataTermino)}
                  </small>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'idioma':
        const idioma = contribuicao.dadosEstruturados as DadosIdioma;
        return (
          <div>
            <div className="mb-2">
              <strong className="d-block">{idioma.idioma}</strong>
            </div>
            <div>
              <Badge theme={getBadgeVariant(idioma.nivel)}>
                {idioma.nivel}
              </Badge>
            </div>
          </div>
        );
        
      default:
        return (
          <div>
            <p>{contribuicao.descricao}</p>
          </div>
        );
    }
  };

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="mb-1 font-weight-bold">
              {contribuicao.titulo}
            </h6>
            <small className="text-muted">
              {formatDate(contribuicao.createdAt.toString())}
            </small>
          </div>
          <div className="ml-2">
            <i 
              className="material-icons" 
              style={{ 
                color: getTipoColor(contribuicao.tipo),
                fontSize: '20px'
              }}
            >
              {getTipoIcon(contribuicao.tipo)}
            </i>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="flex-grow-1">
        {renderContent()}
      </CardBody>
      
      {showActions && (
        <CardFooter className="border-top bg-light">
          <div className="d-flex justify-content-end">
            <Button 
              size="sm" 
              theme="outline-primary"
              className="mr-2"
              onClick={() => onEdit(contribuicao)}
            >
              <i className="material-icons mr-1" style={{ fontSize: '14px' }}>edit</i>
              Editar
            </Button>
            <Button 
              size="sm" 
              theme="outline-danger"
              onClick={() => onDelete(contribuicao.id, contribuicao.titulo)}
            >
              <i className="material-icons mr-1" style={{ fontSize: '14px' }}>delete</i>
              Eliminar
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ContribuicaoCardUnificado;
