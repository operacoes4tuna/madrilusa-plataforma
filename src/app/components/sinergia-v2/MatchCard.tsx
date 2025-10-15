import React, { useState } from 'react';
import { 
  Card, 
  CardBody,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'shards-react';
import CompatibilityBreakdown from './CompatibilityBreakdown';
import FeedbackModal from './FeedbackModal';
// import CompleteProfileModal from './CompleteProfileModal'; // Temporariamente removido
import type { RigorousMatchFrontend } from '../../../types/sinergia-v2.types';

interface MatchCardProps {
  match: RigorousMatchFrontend;
  viewMode: 'opportunity' | 'immigrant'; // Para empresa vendo candidatos ou imigrante vendo oportunidades
  onRequestContact?: (match: RigorousMatchFrontend) => void;
  onExportMatch?: (match: RigorousMatchFrontend) => void;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  viewMode,
  onRequestContact,
  onExportMatch,
  className = ''
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showJustificativa, setShowJustificativa] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (score: number): string => {
    if (score >= 80) return 'star';
    if (score >= 60) return 'check_circle';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getCompatibilityLevel = (score: number): string => {
    if (score >= 80) return 'ALTA';
    if (score >= 60) return 'BOA';
    if (score >= 40) return 'MODERADA';
    return 'BAIXA';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasAIAnalysis = match.tokensUsed > 0;
  const hasEliminatoryIssues = match.penalizacoes.length > 0;

  return (
    <>
      <Card className={`match-card ${className}`}>
        <CardBody>
          {/* Header com Score */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1 d-flex align-items-start">
              {viewMode === 'opportunity' ? (
                // Empresa vendo candidatos - INFORMAÇÕES COMPLETAS
                <>
                  {match.imigrante?.foto && (
                    <img
                      src={match.imigrante.foto.startsWith('/uploads/') ? `http://localhost:3001${match.imigrante.foto}` : match.imigrante.foto}
                      alt={match.imigrante.nomeCompleto}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '15px',
                        border: '3px solid #F5A623'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h5 className="mb-1">
                      {match.imigrante?.nomeCompleto || 'Candidato'}
                    </h5>
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>location_on</i>
                      {match.imigrante?.municipioResidencia || 'Localização não informada'}
                    </small>
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>email</i>
                      {match.imigrante?.email}
                    </small>
                    {/* NOVOS DADOS COMPLETOS */}
                    {match.imigrante?.genero && (
                      <small className="text-muted d-block">
                        <i className="material-icons mr-1" style={{ fontSize: '14px' }}>person</i>
                        {match.imigrante.genero}, {match.imigrante.idade} anos
                      </small>
                    )}
                    {match.imigrante?.fluenciaPortugues && (
                      <small className="text-muted d-block">
                        <i className="material-icons mr-1" style={{ fontSize: '14px' }}>language</i>
                        Português: {match.imigrante.fluenciaPortugues}
                      </small>
                    )}
                    {match.imigrante?.transporteProprio !== undefined && (
                      <small className="text-muted d-block">
                        <i className="material-icons mr-1" style={{ fontSize: '14px' }}>directions_car</i>
                        Transporte: {match.imigrante.transporteProprio ? 'Próprio' : 'Não tem'}
                      </small>
                    )}
                  </div>
                </>
              ) : (
                // Imigrante vendo oportunidades - INFORMAÇÕES COMPLETAS
                <>
                  {match.dadosEstruturados?.empresaFoto && (
                    <img
                      src={match.dadosEstruturados.empresaFoto.startsWith('/uploads/') ? `http://localhost:3001${match.dadosEstruturados.empresaFoto}` : match.dadosEstruturados.empresaFoto}
                      alt={match.dadosEstruturados.empresa}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '15px',
                        border: '3px solid #4A90A4'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                  <h5 className="mb-1">
                    {match.oportunidade?.titulo || 'Oportunidade de Trabalho'}
                  </h5>
                  <small className="text-muted d-block">
                    <i className="material-icons mr-1" style={{ fontSize: '14px' }}>work</i>
                    {match.oportunidade?.nomeCargo}
                  </small>
                  <small className="text-muted d-block">
                    <i className="material-icons mr-1" style={{ fontSize: '14px' }}>business</i>
                    {match.oportunidade?.empresa || match.dadosEstruturados?.empresa || 'Empresa não informada'}
                  </small>
                  {/* NOVOS DADOS COMPLETOS DA OPORTUNIDADE */}
                  {match.dadosEstruturados?.municipioResidencia && (
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>location_city</i>
                      Local: {match.dadosEstruturados.municipioResidencia}
                    </small>
                  )}
                  {match.dadosEstruturados?.genero && match.dadosEstruturados.genero !== 'INDIFERENTE' && (
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>person_outline</i>
                      Requisito: {match.dadosEstruturados.genero === 'F' ? 'Feminino' : 'Masculino'}
                    </small>
                  )}
                  {match.dadosEstruturados?.transporteProprio === 'S' && (
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>directions_car</i>
                      Requisito: Transporte próprio obrigatório
                    </small>
                  )}
                  {match.dadosEstruturados?.fluenciaPortugues === 'S' && (
                    <small className="text-muted d-block">
                      <i className="material-icons mr-1" style={{ fontSize: '14px' }}>language</i>
                      Requisito: Português fluente obrigatório
                    </small>
                  )}
                  </div>
                </>
              )}
            </div>
            
            <div className="text-right">
              <Badge 
                theme={getScoreColor(match.scoreTotal)}
                className="mb-2"
                style={{ fontSize: '16px', padding: '8px 12px' }}
              >
                <i className="material-icons mr-1" style={{ fontSize: '18px' }}>
                  {getScoreIcon(match.scoreTotal)}
                </i>
                {match.scoreTotal}%
              </Badge>
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {getCompatibilityLevel(match.scoreTotal)} COMPATIBILIDADE
              </div>
            </div>
          </div>

          {/* Badges de Status */}
          <div className="mb-3">
            {hasEliminatoryIssues && (
              <Badge theme="danger" className="mr-2">
                <i className="material-icons mr-1" style={{ fontSize: '12px' }}>warning</i>
                Critérios Eliminatórios
              </Badge>
            )}

            {match.scoreTotal >= 70 && (
              <Badge theme="success" className="mr-2">
                <i className="material-icons mr-1" style={{ fontSize: '12px' }}>recommend</i>
                Recomendado
              </Badge>
            )}
          </div>

          {/* Matches Highlights */}
          <div className="mb-3">
            <small className="text-muted d-block mb-1">Pontos Compatíveis:</small>
            <div className="d-flex flex-wrap">
              {match.matchedItems.slice(0, 3).map((item, index) => (
                <Badge key={index} theme="light" className="mr-1 mb-1" style={{ fontSize: '11px' }}>
                  <i className="material-icons mr-1" style={{ fontSize: '10px' }}>check</i>
                  {item}
                </Badge>
              ))}
              {match.matchedItems.length > 3 && (
                <Badge theme="light" className="mr-1 mb-1" style={{ fontSize: '11px' }}>
                  +{match.matchedItems.length - 3} mais
                </Badge>
              )}
            </div>
          </div>

          {/* Pontos de Atenção */}
          {match.unmatchedItems.length > 0 && (
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Pontos de Atenção:</small>
              <div className="d-flex flex-wrap">
                {match.unmatchedItems.slice(0, 2).map((item, index) => (
                  <Badge key={index} theme="warning" className="mr-1 mb-1" style={{ fontSize: '11px' }}>
                    <i className="material-icons mr-1" style={{ fontSize: '10px' }}>warning</i>
                    {item}
                  </Badge>
                ))}
                {match.unmatchedItems.length > 2 && (
                  <Badge theme="warning" className="mr-1 mb-1" style={{ fontSize: '11px' }}>
                    +{match.unmatchedItems.length - 2} mais
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="match-card-actions">
            {/* Primeira linha - Botões de informação */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              <Button
                size="sm"
                theme="outline-primary"
                onClick={() => setShowBreakdown(true)}
                style={{ minWidth: '110px' }}
              >
                <i className="material-icons mr-1" style={{ fontSize: '14px' }}>analytics</i>
                Detalhes
              </Button>

              <Button
                size="sm"
                theme="outline-secondary"
                onClick={() => setShowJustificativa(true)}
                style={{ minWidth: '130px' }}
              >
                <i className="material-icons mr-1" style={{ fontSize: '14px' }}>description</i>
                Justificativa
              </Button>

              <Button
                size="sm"
                theme="outline-warning"
                onClick={() => setShowFeedback(true)}
                style={{ minWidth: '110px' }}
              >
                <i className="material-icons mr-1" style={{ fontSize: '14px' }}>feedback</i>
                Feedback
              </Button>
            </div>

            {/* Segunda linha - Botões de ação principal */}
            <div className="d-flex justify-content-end gap-2">
              {onExportMatch && (
                <Button
                  size="sm"
                  theme="outline-info"
                  onClick={() => onExportMatch(match)}
                  style={{ minWidth: '110px' }}
                >
                  <i className="material-icons mr-1" style={{ fontSize: '14px' }}>download</i>
                  Exportar
                </Button>
              )}

              {onRequestContact && match.scoreTotal >= 40 && (
                <Button
                  size="sm"
                  theme="primary"
                  onClick={() => onRequestContact(match)}
                  style={{ minWidth: '160px' }}
                >
                  <i className="material-icons mr-1" style={{ fontSize: '14px' }}>contact_mail</i>
                  Solicitar Contato
                </Button>
              )}
            </div>
          </div>

          <style>{`
            .match-card-actions .gap-2 > * {
              margin-right: 8px;
              margin-bottom: 4px;
            }

            @media (max-width: 768px) {
              .match-card-actions .d-flex {
                flex-direction: column;
              }

              .match-card-actions button {
                width: 100%;
                min-width: unset !important;
              }
            }
          `}</style>

          {/* Metadata */}
          <div className="mt-3 pt-2 border-top">
            <small className="text-muted">
              <i className="material-icons mr-1" style={{ fontSize: '12px' }}>schedule</i>
              Analisado em {formatDate(match.createdAt)}
            </small>
          </div>
        </CardBody>
      </Card>

      {/* Modal de Breakdown Detalhado */}
      <Modal 
        open={showBreakdown} 
        toggle={() => setShowBreakdown(false)} 
        size="xl"
        style={{ maxHeight: '90vh' }}
      >
        <ModalHeader>
          <div className="d-flex align-items-center">
            <i className="material-icons mr-2">analytics</i>
            Análise Detalhada de Compatibilidade
          </div>
        </ModalHeader>
        <ModalBody style={{ maxHeight: 'calc(90vh - 160px)', overflowY: 'auto' }}>
          <CompatibilityBreakdown 
            breakdown={match.breakdown}
            scoreTotal={match.scoreTotal}
            match={match}
          />
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={() => setShowBreakdown(false)}>
            Fechar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Justificativa */}
      <Modal 
        open={showJustificativa} 
        toggle={() => setShowJustificativa(false)} 
        size="lg"
      >
        <ModalHeader>
          <div className="d-flex align-items-center">
            <i className="material-icons mr-2">description</i>
            Justificativa da Análise
          </div>
        </ModalHeader>
        <ModalBody>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
            {match.justificativa}
          </div>
          
          {hasAIAnalysis && (
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <i className="material-icons mr-1" style={{ fontSize: '14px' }}>psychology</i>
                Esta análise incluiu processamento por Inteligência Artificial ({match.tokensUsed} tokens utilizados)
              </small>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={() => setShowJustificativa(false)}>
            Fechar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={showFeedback}
        match={match}
        onClose={() => setShowFeedback(false)}
        onSubmit={() => {
          // Callback após envio de feedback
          console.log('Feedback enviado para match:', match.oportunidadeId, match.imigranteId);
        }}
      />

      {/* Modal de Perfil Completo - Temporariamente removido
      <CompleteProfileModal
        isOpen={showCompleteProfile}
        match={match}
        viewMode={viewMode}
        onClose={() => setShowCompleteProfile(false)}
      />
      */}
    </>
  );
};

export default MatchCard;
