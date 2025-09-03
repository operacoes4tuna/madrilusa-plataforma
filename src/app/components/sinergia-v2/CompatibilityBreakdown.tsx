import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Progress,
  Badge
} from 'shards-react';
import type { MatchingCriteriaFrontend } from '../../../types/sinergia-v2.types';

interface CompatibilityBreakdownProps {
  breakdown: MatchingCriteriaFrontend;
  scoreTotal: number;
  className?: string;
}

const CompatibilityBreakdown: React.FC<CompatibilityBreakdownProps> = ({
  breakdown,
  scoreTotal,
  className = ''
}) => {
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (score: number): string => {
    if (score >= 80) return 'check_circle';
    if (score >= 60) return 'check';
    if (score >= 40) return 'warning';
    return 'cancel';
  };

  const criteriaData = [
    {
      title: 'Critérios Demográficos',
      weight: '40%',
      items: [
        {
          name: 'Género',
          score: breakdown.genero.score,
          match: breakdown.genero.match,
          required: breakdown.genero.required,
          details: breakdown.genero.details,
          weight: '10%'
        },
        {
          name: 'Município',
          score: breakdown.municipio.score,
          match: breakdown.municipio.match,
          required: false,
          details: breakdown.municipio.details,
          weight: '15%'
        },
        {
          name: 'Idade',
          score: breakdown.idade.score,
          match: breakdown.idade.match,
          required: false,
          details: breakdown.idade.details,
          weight: '10%'
        }
      ]
    },
    {
      title: 'Critérios Essenciais',
      weight: '30%',
      items: [
        {
          name: 'Transporte Próprio',
          score: breakdown.transporteProprio.score,
          match: breakdown.transporteProprio.match,
          required: breakdown.transporteProprio.required,
          details: breakdown.transporteProprio.details,
          weight: '10%'
        },
        {
          name: 'Fluência Português',
          score: breakdown.fluenciaPortugues.score,
          match: breakdown.fluenciaPortugues.match,
          required: false,
          details: breakdown.fluenciaPortugues.details,
          weight: '15%'
        }
      ]
    },
    {
      title: 'Critérios Profissionais',
      weight: '20%',
      items: [
        {
          name: 'Experiências',
          score: breakdown.experiencias.score,
          match: breakdown.experiencias.matches.length > 0,
          required: false,
          details: breakdown.experiencias.details,
          weight: '20%',
          extra: `${breakdown.experiencias.matches.length} matches: ${breakdown.experiencias.matches.join(', ')}`
        },
        {
          name: 'Formação',
          score: breakdown.formacao.score,
          match: breakdown.formacao.match,
          required: false,
          details: breakdown.formacao.details,
          weight: '15%'
        }
      ]
    },
    {
      title: 'Critérios Complementares',
      weight: '10%',
      items: [
        {
          name: 'Idiomas',
          score: breakdown.idiomas.score,
          match: breakdown.idiomas.matches.length > 0,
          required: false,
          details: breakdown.idiomas.details,
          weight: '5%',
          extra: breakdown.idiomas.matches.length > 0 ? 
            `${breakdown.idiomas.matches.join(', ')}` : undefined
        },
        {
          name: 'Habilidades',
          score: breakdown.habilidades.score,
          match: breakdown.habilidades.matches.length > 0,
          required: false,
          details: breakdown.habilidades.details,
          weight: '3%'
        },
        {
          name: 'Características',
          score: breakdown.caracteristicas.score,
          match: breakdown.caracteristicas.matches.length > 0,
          required: false,
          details: breakdown.caracteristicas.details,
          weight: '2%'
        }
      ]
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Breakdown de Compatibilidade</h5>
          <div className="d-flex align-items-center">
            <Badge 
              theme={getScoreColor(scoreTotal)}
              className="mr-2"
              style={{ fontSize: '14px', padding: '6px 12px' }}
            >
              <i className="material-icons mr-1" style={{ fontSize: '16px' }}>
                {getScoreIcon(scoreTotal)}
              </i>
              {scoreTotal}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        {/* Score Total Visual */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="font-weight-bold">Compatibilidade Geral</span>
            <span className="text-muted">{scoreTotal}%</span>
          </div>
          <Progress 
            value={scoreTotal} 
            theme={getScoreColor(scoreTotal)}
            className="mb-2"
            style={{ height: '8px' }}
          />
          <small className="text-muted">
            {scoreTotal >= 80 && "🎯 Alta compatibilidade - Candidato muito adequado"}
            {scoreTotal >= 60 && scoreTotal < 80 && "✅ Boa compatibilidade - Candidato adequado"}
            {scoreTotal >= 40 && scoreTotal < 60 && "⚠️ Compatibilidade moderada - Considerar com ressalvas"}
            {scoreTotal < 40 && "❌ Baixa compatibilidade - Não atende requisitos essenciais"}
          </small>
        </div>

        {/* Breakdown por Categorias */}
        {criteriaData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-primary">{category.title}</h6>
              <small className="text-muted font-weight-bold">Peso: {category.weight}</small>
            </div>
            
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="mb-3 pl-3 border-left" style={{ borderLeftWidth: '3px', borderLeftColor: item.required && !item.match ? '#dc3545' : '#e9ecef' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center">
                    <span className="font-weight-medium">{item.name}</span>
                    {item.required && (
                      <Badge theme="warning" className="ml-2" style={{ fontSize: '10px' }}>
                        Obrigatório
                      </Badge>
                    )}
                    <small className="text-muted ml-2">({item.weight})</small>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <i className={`material-icons mr-1 ${item.match ? 'text-success' : 'text-danger'}`} style={{ fontSize: '16px' }}>
                      {item.match ? 'check_circle' : 'cancel'}
                    </i>
                    <span className={`font-weight-bold ${getScoreColor(item.score) === 'success' ? 'text-success' : getScoreColor(item.score) === 'danger' ? 'text-danger' : 'text-warning'}`}>
                      {item.score}%
                    </span>
                  </div>
                </div>
                
                <Progress 
                  value={item.score} 
                  theme={getScoreColor(item.score)}
                  className="mb-1"
                  style={{ height: '4px' }}
                />
                
                <small className="text-muted d-block">{item.details}</small>
                
                {item.extra && (
                  <small className="text-info d-block mt-1">
                    <i className="material-icons mr-1" style={{ fontSize: '12px' }}>info</i>
                    {item.extra}
                  </small>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Resumo de Compatibilidade */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="mb-2">
            <i className="material-icons mr-1">assessment</i>
            Resumo da Análise
          </h6>
          
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted d-block">Critérios Atendidos:</small>
              <div className="d-flex align-items-center mb-2">
                <i className="material-icons text-success mr-1" style={{ fontSize: '16px' }}>check_circle</i>
                <span className="font-weight-bold text-success">
                  {Object.values(breakdown).filter(criteria => 
                    typeof criteria === 'object' && 'match' in criteria && criteria.match
                  ).length}
                </span>
                <span className="text-muted ml-1">/ 10 critérios</span>
              </div>
            </div>
            
            <div className="col-md-6">
              <small className="text-muted d-block">Critérios Eliminatórios:</small>
              <div className="d-flex align-items-center mb-2">
                {(breakdown.genero.required && !breakdown.genero.match) || 
                 (breakdown.transporteProprio.required && !breakdown.transporteProprio.match) ? (
                  <>
                    <i className="material-icons text-danger mr-1" style={{ fontSize: '16px' }}>error</i>
                    <span className="font-weight-bold text-danger">Não atende</span>
                  </>
                ) : (
                  <>
                    <i className="material-icons text-success mr-1" style={{ fontSize: '16px' }}>check_circle</i>
                    <span className="font-weight-bold text-success">Atende</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CompatibilityBreakdown;
