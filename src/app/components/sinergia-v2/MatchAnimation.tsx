import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { RigorousMatchFrontend } from '../../../types/sinergia-v2.types';

interface MatchAnimationProps {
  topMatch: RigorousMatchFrontend | null;
  isEmpresa: boolean;
}

const MatchAnimation: React.FC<MatchAnimationProps> = ({ topMatch, isEmpresa }) => {
  const { user } = useAuth();
  const [animationState, setAnimationState] = useState<'idle' | 'moving' | 'matched'>('idle');
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (topMatch) {
      // Iniciar animação
      setTimeout(() => setAnimationState('moving'), 300);
      setTimeout(() => {
        setAnimationState('matched');
        setShowParticles(true);
      }, 2000);
      setTimeout(() => setShowParticles(false), 3500);
    } else {
      setAnimationState('idle');
      setShowParticles(false);
    }
  }, [topMatch]);

  if (!topMatch) return null;

  const imigranteFoto = '/default-avatar.svg';
  const empresaFoto = '/default-company.svg';

  const imigranteNome = isEmpresa
    ? topMatch.imigrante?.nomeCompleto || 'Candidato'
    : user?.nomeCompleto || 'Você';

  const empresaNome = isEmpresa
    ? user?.nomeCompleto || 'Sua Empresa'
    : topMatch.oportunidade?.empresa || 'Empresa';

  const score = Math.round(topMatch.scoreTotal);

  return (
    <Card className="match-animation-card mb-4">
      <CardBody className="p-4">
        <div className="match-animation-container">
          {/* Container das imagens */}
          <div className="match-images-wrapper">
            {/* Foto Imigrante */}
            <div
              className={`match-photo match-photo-left ${animationState}`}
              data-state={animationState}
            >
              <div className="photo-frame">
                <img
                  src={imigranteFoto}
                  alt={imigranteNome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <div className="photo-label">
                  <i className="material-icons">person</i>
                  <span>{imigranteNome}</span>
                </div>
              </div>
            </div>

            {/* Score Central */}
            <div className={`match-score-center ${animationState}`}>
              <div className="score-circle">
                <div className="score-value">{score}%</div>
                <div className="score-label">Match</div>
              </div>

              {/* Ícone de Check quando matched */}
              {animationState === 'matched' && (
                <div className="match-success-icon">
                  <i className="material-icons">check_circle</i>
                </div>
              )}
            </div>

            {/* Foto Empresa */}
            <div
              className={`match-photo match-photo-right ${animationState}`}
              data-state={animationState}
            >
              <div className="photo-frame">
                <img
                  src={empresaFoto}
                  alt={empresaNome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-company.png';
                  }}
                />
                <div className="photo-label">
                  <i className="material-icons">business</i>
                  <span>{empresaNome}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partículas de celebração */}
          {showParticles && (
            <div className="particles-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    '--angle': `${(360 / 20) * i}deg`,
                    '--delay': `${Math.random() * 0.3}s`,
                    '--duration': `${1 + Math.random() * 0.5}s`,
                    '--color': ['#F5A623', '#4A90A4', '#28a745', '#ffc107'][i % 4]
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* Mensagem de match */}
          {animationState === 'matched' && (
            <div className="match-message">
              <div className="match-message-content">
                <i className="material-icons">celebration</i>
                <h4>Compatibilidade Encontrada!</h4>
                <p>
                  {isEmpresa
                    ? `${imigranteNome} é ${score >= 80 ? 'altamente' : 'muito'} compatível com sua oportunidade`
                    : `Esta oportunidade em ${empresaNome} é ${score >= 80 ? 'altamente' : 'muito'} compatível com seu perfil`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </CardBody>

      <style>{`
        /* Container principal */
        .match-animation-container {
          position: relative;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Wrapper das imagens */
        .match-images-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          margin-bottom: 30px;
        }

        /* Fotos */
        .match-photo {
          position: relative;
          z-index: 2;
          transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .match-photo.idle {
          transform: translateX(0) scale(1);
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }

        .match-photo-left.moving {
          transform: translateX(280px) scale(1.05);
        }

        .match-photo-right.moving {
          transform: translateX(-280px) scale(1.05);
        }

        .match-photo-left.matched,
        .match-photo-right.matched {
          transform: translateX(0) scale(1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Frame da foto */
        .photo-frame {
          position: relative;
          text-align: center;
        }

        .photo-frame img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          background: #f0f0f0;
          transition: all 0.3s ease;
        }

        .match-photo.matched .photo-frame img {
          border-color: #28a745;
          box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
        }

        .photo-label {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .photo-label i {
          font-size: 18px;
          color: #4A90A4;
        }

        /* Score central */
        .match-score-center {
          position: absolute;
          left: 50%;
          top: 30px;
          transform: translateX(-50%);
          z-index: 3;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .match-score-center.idle {
          opacity: 0;
          transform: translateX(-50%) scale(0.5);
        }

        .match-score-center.moving {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }

        .match-score-center.matched {
          opacity: 1;
          transform: translateX(-50%) scale(1.1);
        }

        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5A623 0%, #ff8c00 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(245, 166, 35, 0.3);
          color: white;
          position: relative;
        }

        .match-score-center.matched .score-circle {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          box-shadow: 0 8px 32px rgba(40, 167, 69, 0.4);
          animation: pulse 0.6s ease-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .score-value {
          font-size: 32px;
          font-weight: bold;
          line-height: 1;
        }

        .score-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        /* Ícone de sucesso */
        .match-success-icon {
          position: absolute;
          top: -20px;
          right: -20px;
          animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .match-success-icon i {
          font-size: 40px;
          color: #28a745;
          filter: drop-shadow(0 4px 8px rgba(40, 167, 69, 0.3));
        }

        @keyframes successPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        /* Partículas */
        .particles-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 4;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color);
          animation: particleBurst var(--duration) ease-out var(--delay) forwards;
          transform-origin: center;
          opacity: 0;
        }

        @keyframes particleBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform:
              translate(
                calc(cos(var(--angle)) * 120px),
                calc(sin(var(--angle)) * 120px)
              )
              scale(1.5);
            opacity: 0;
          }
        }

        /* Mensagem de match */
        .match-message {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .match-message-content {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(40, 167, 69, 0.1) 100%);
          border-radius: 12px;
          border: 2px solid rgba(40, 167, 69, 0.2);
        }

        .match-message-content i {
          font-size: 36px;
          color: #28a745;
          margin-bottom: 8px;
        }

        .match-message-content h4 {
          color: #28a745;
          font-size: 20px;
          font-weight: bold;
          margin: 8px 0;
        }

        .match-message-content p {
          color: #666;
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .match-images-wrapper {
            padding: 0 20px;
          }

          .match-photo-left.moving {
            transform: translateX(150px) scale(1.05);
          }

          .match-photo-right.moving {
            transform: translateX(-150px) scale(1.05);
          }

          .photo-frame img {
            width: 90px;
            height: 90px;
          }

          .score-circle {
            width: 80px;
            height: 80px;
          }

          .score-value {
            font-size: 24px;
          }
        }
      `}</style>
    </Card>
  );
};

export default MatchAnimation;
