import React from 'react';
import { Button } from 'shards-react';

// Tipos para o modal
interface Match {
  score: number;
  explanation: string;
  contributionType: string;
  targetCategory: string;
  targetContributionId: string;
  commonTags: string[];
}

interface EntityDetails {
  entityName: string;
  entityCategory: string;
  entityEmail: string;
  contributionId: string;
  contributionType: string;
  contributionDescription: string;
  contributionTags: string[];
  contributionContext?: string;
  createdAt: string;
  isAdminPreview: boolean;
}

interface InformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  entityDetails: EntityDetails;
}

const InformationModal: React.FC<InformationModalProps> = ({
  isOpen,
  onClose,
  match,
  entityDetails
}) => {
  if (!isOpen) return null;

  const getCategoryColor = (categoria: string): string => {
    const colors: Record<string, string> = {
      'EMPRESA': '#007bff',
      'MUNICIPIO': '#ffc107',
      'ACADEMIA': '#17a2b8',
      'FAMILIA_ACOLHIMENTO': '#e83e8c'
    };
    return colors[categoria] || '#6c757d';
  };

  const getCategoryLabel = (categoria: string): string => {
    const labels: Record<string, string> = {
      'EMPRESA': 'Empresa',
      'MUNICIPIO': 'Município',
      'ACADEMIA': 'Academia',
      'FAMILIA_ACOLHIMENTO': 'Família de Acolhimento'
    };
    return labels[categoria] || categoria;
  };

  const renderProgressBar = (score: number) => {
    const percentage = Math.min(100, Math.max(0, score));
    const barColor = percentage >= 70 ? '#28a745' : percentage >= 50 ? '#ffc107' : '#17a2b8';
    
    return (
      <div className="progress mb-2" style={{ height: '12px' }}>
        <div 
          className="progress-bar" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: barColor 
          }}
        />
      </div>
    );
  };

  return (
    <div className="modal fade show" style={{display: 'block'}} onClick={onClose}>
      <div 
        className="modal-dialog modal-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', margin: '2rem auto' }}
      >
        <div 
          className="modal-content" 
          style={{ 
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column' 
          }}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="modal-title mb-0">
                <i className="material-icons mr-2" style={{color: '#F5A623'}}>
                  info
                </i>
                Informações da Sinergia
              </h5>
              <span className="badge badge-warning">ADMIN PREVIEW</span>
            </div>
            <button 
              type="button" 
              className="btn-close ml-3"
              onClick={onClose}
              style={{ fontSize: '20px', background: 'none', border: 'none' }}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div 
            className="modal-body" 
            style={{ 
              flexGrow: 1, 
              overflowY: 'auto',
              padding: '1.5rem'
            }}
          >
            {/* Porcentagem de Sinergia */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="material-icons mr-2" style={{color: '#F5A623'}}>
                  analytics
                </i>
                Sinergia Detectada
              </h6>
              <div className="d-flex align-items-center mb-2">
                <div className="flex-grow-1 mr-3">
                  {renderProgressBar(match.score)}
                </div>
                <strong style={{fontSize: '18px', color: getCategoryColor(entityDetails.entityCategory)}}>
                  {match.score}%
                </strong>
              </div>
            </div>

            {/* Dados da Entidade */}
            <div className="mb-4 p-3 border rounded" style={{backgroundColor: '#f8f9fa'}}>
              <h6 className="mb-3">
                <i 
                  className="material-icons mr-2" 
                  style={{color: getCategoryColor(entityDetails.entityCategory)}}
                >
                  {entityDetails.entityCategory === 'EMPRESA' ? 'business' :
                   entityDetails.entityCategory === 'MUNICIPIO' ? 'location_city' :
                   entityDetails.entityCategory === 'ACADEMIA' ? 'school' : 'home'}
                </i>
                Entidade Compatível
              </h6>
              
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Nome:</strong> 
                    <span className="ml-2" style={{color: getCategoryColor(entityDetails.entityCategory)}}>
                      {entityDetails.entityName}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Categoria:</strong> {getCategoryLabel(entityDetails.entityCategory)}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Email:</strong> 
                    <code className="ml-2">{entityDetails.entityEmail}</code>
                  </p>
                  <p className="mb-2">
                    <strong>Registo:</strong> {new Date(entityDetails.createdAt).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>
              
              <div className="alert alert-warning py-2 mt-3 mb-0">
                <small>
                  <i className="material-icons mr-1" style={{fontSize: '14px'}}>visibility_off</i>
                  <strong>Futuro:</strong> Na versão de produção, estes dados serão confidenciais 
                  e disponibilizados apenas via administração Madrilusa.
                </small>
              </div>
            </div>

            {/* Contribuição Detalhada */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="material-icons mr-2" style={{color: '#4A90A4'}}>
                  assignment
                </i>
                Contribuição Compatível
              </h6>
              
              <div className="mb-3">
                <strong>Tipo:</strong> 
                <span className="ml-2 badge" style={{backgroundColor: getCategoryColor(entityDetails.entityCategory), color: '#fff'}}>
                  {entityDetails.contributionType}
                </span>
              </div>
              
              <div className="mb-3">
                <strong>Descrição:</strong>
                <div className="p-3 border rounded bg-white mt-2">
                  <p className="mb-0 small" style={{lineHeight: '1.5'}}>
                    {entityDetails.contributionDescription}
                  </p>
                </div>
              </div>
              
              {entityDetails.contributionTags.length > 0 && (
                <div className="mb-3">
                  <strong>Tags:</strong>
                  <div className="mt-2">
                    {entityDetails.contributionTags.map((tag, i) => (
                      <span 
                        key={i} 
                        className={`badge mr-1 mb-1 ${match.commonTags.includes(tag) ? 'badge-primary' : 'badge-secondary'}`}
                        title={match.commonTags.includes(tag) ? 'Tag em comum' : 'Tag específica'}
                      >
                        {match.commonTags.includes(tag) && '✓ '}{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Análise da IA */}
            <div className="mb-4">
              <h6 className="mb-3">
                <i className="material-icons mr-2" style={{color: '#F5A623'}}>
                  psychology
                </i>
                Análise da IA
              </h6>
              
              <div className="p-3 border rounded" style={{backgroundColor: '#f0f8ff'}}>
                <p className="mb-3" style={{lineHeight: '1.6'}}>
                  <i className="material-icons mr-2 text-primary" style={{fontSize: '16px'}}>
                    format_quote
                  </i>
                  {match.explanation}
                </p>
                
                {match.commonTags.length > 0 && (
                  <div>
                    <small className="text-muted">
                      <strong>Tags em comum identificadas:</strong>
                    </small>
                    <div className="mt-1">
                      {match.commonTags.map((tag, i) => (
                        <span key={i} className="badge badge-primary mr-1">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contexto Adicional */}
            {entityDetails.contributionContext && (
              <div className="mb-4">
                <h6 className="mb-2">
                  <i className="material-icons mr-2" style={{color: '#6c757d'}}>
                    help_outline
                  </i>
                  Contexto do Tipo
                </h6>
                <div className="p-2 border rounded bg-light">
                  <small className="text-muted">{entityDetails.contributionContext}</small>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ flexShrink: 0 }}>
            <div className="w-100">
              <div className="alert alert-info py-2 mb-3">
                <div className="d-flex align-items-start">
                  <i className="material-icons mr-2 text-info" style={{fontSize: '18px'}}>
                    security
                  </i>
                  <div>
                    <small>
                      <strong>Modo Demonstração:</strong> Esta funcionalidade está a ser demonstrada 
                      para administradores com dados completos visíveis. Na versão de produção, 
                      os dados das entidades serão mantidos confidenciais e o contacto será 
                      mediado pela administração Madrilusa.
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button theme="primary" onClick={onClose}>
                  <i className="material-icons mr-1" style={{fontSize: '16px'}}>
                    check_circle
                  </i>
                  Entendido
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
