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
      setTimeout(() => setAnimationState('moving'), 500);
      setTimeout(() => {
        setAnimationState('matched');
        setShowParticles(true);

        // Tocar som de sucesso
        const audio = new Audio('/api/play/success-match.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => {
          console.log('Não foi possível tocar o som:', err);
        });
      }, 2500);
      setTimeout(() => setShowParticles(false), 5000);
    } else {
      setAnimationState('idle');
      setShowParticles(false);
    }
  }, [topMatch]);

  if (!topMatch) return null;

  // Buscar fotos reais dos perfis
  const imigranteFoto = isEmpresa
    ? (topMatch.imigrante?.foto || '/default-avatar.svg')
    : (user?.foto || '/default-avatar.svg');

  const empresaFoto = isEmpresa
    ? (user?.foto || '/default-company.svg')
    : (topMatch.dadosEstruturados?.empresaFoto || '/default-company.svg');

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
                  src={imigranteFoto.startsWith('/uploads/') ? `http://localhost:3001${imigranteFoto}` : imigranteFoto}
                  alt={imigranteNome}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback para avatar padrão
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div style="
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #F5A623 0%, #ff8c00 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        font-weight: bold;
                        border: 4px solid #F5A623;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                      ">
                        ${imigranteNome.charAt(0).toUpperCase()}
                      </div>
                      ${target.parentElement!.querySelector('.photo-label')?.outerHTML || ''}
                    `;
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
                  src={empresaFoto.startsWith('/uploads/') ? `http://localhost:3001${empresaFoto}` : empresaFoto}
                  alt={empresaNome}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Fallback para ícone de empresa padrão
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div style="
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #4A90A4 0%, #357a8a 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 48px;
                        font-weight: bold;
                        border: 4px solid #4A90A4;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                      ">
                        ${empresaNome.charAt(0).toUpperCase()}
                      </div>
                      ${target.parentElement!.querySelector('.photo-label')?.outerHTML || ''}
                    `;
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
            <>
              <div className="confetti-container">
                {[...Array(80)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      '--angle': `${(360 / 80) * i}deg`,
                      '--delay': `${Math.random() * 0.3}s`,
                      '--duration': `${1.5 + Math.random() * 1}s`,
                      '--color': ['#F5A623', '#4A90A4', '#28a745', '#ffc107', '#e74c3c', '#9b59b6', '#ff6b6b', '#4ecdc4'][i % 8],
                      '--size': `${10 + Math.random() * 6}px`,
                      '--rotation': `${Math.random() * 1080}deg`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
              {/* Confetes caindo de cima */}
              <div className="confetti-rain">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--x-pos': `${Math.random() * 100}%`,
                      '--delay': `${Math.random() * 0.8}s`,
                      '--duration': `${2 + Math.random() * 1.5}s`,
                      '--color': ['#F5A623', '#4A90A4', '#28a745', '#ffc107', '#e74c3c', '#9b59b6', '#ff6b6b', '#4ecdc4'][i % 8],
                      '--rotation': `${Math.random() * 720}deg`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </>
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
          transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .match-photo.idle {
          transform: translateX(0) scale(1);
          opacity: 0;
          animation: fadeInBounce 0.8s ease-out forwards;
        }

        .match-photo-left.moving {
          transform: translateX(150px) translateY(-10px) scale(1.2) rotate(5deg);
        }

        .match-photo-right.moving {
          transform: translateX(-150px) translateY(-10px) scale(1.2) rotate(-5deg);
        }

        .match-photo-left.matched {
          transform: translateX(80px) translateY(0) scale(0.95) rotate(0deg);
          animation: smoothMatchLeft 1.2s ease-out;
        }

        .match-photo-right.matched {
          transform: translateX(-80px) translateY(0) scale(0.95) rotate(0deg);
          animation: smoothMatchRight 1.2s ease-out;
        }

        @keyframes fadeInBounce {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes smoothMatchLeft {
          0% {
            transform: translateX(150px) translateY(-10px) scale(1.2) rotate(5deg);
          }
          40% {
            transform: translateX(90px) translateY(-3px) scale(1.05) rotate(2deg);
          }
          70% {
            transform: translateX(75px) translateY(2px) scale(0.98) rotate(-1deg);
          }
          85% {
            transform: translateX(82px) translateY(0) scale(0.93) rotate(0.5deg);
          }
          100% {
            transform: translateX(80px) translateY(0) scale(0.95) rotate(0deg);
          }
        }

        @keyframes smoothMatchRight {
          0% {
            transform: translateX(-150px) translateY(-10px) scale(1.2) rotate(-5deg);
          }
          40% {
            transform: translateX(-90px) translateY(-3px) scale(1.05) rotate(-2deg);
          }
          70% {
            transform: translateX(-75px) translateY(2px) scale(0.98) rotate(1deg);
          }
          85% {
            transform: translateX(-82px) translateY(0) scale(0.93) rotate(-0.5deg);
          }
          100% {
            transform: translateX(-80px) translateY(0) scale(0.95) rotate(0deg);
          }
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

        .match-photo-left .photo-frame img {
          border-color: #F5A623;
        }

        .match-photo-right .photo-frame img {
          border-color: #4A90A4;
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
          transform: translateX(-50%) scale(1.2);
          animation: scoreExplode 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes scoreExplode {
          0% {
            transform: translateX(-50%) scale(1);
          }
          30% {
            transform: translateX(-50%) scale(1.4) rotate(5deg);
          }
          50% {
            transform: translateX(-50%) scale(1.1) rotate(-3deg);
          }
          70% {
            transform: translateX(-50%) scale(1.3) rotate(2deg);
          }
          100% {
            transform: translateX(-50%) scale(1.2) rotate(0deg);
          }
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
          transition: all 0.3s ease;
        }

        .match-score-center.matched .score-circle {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          box-shadow: 0 0 40px rgba(40, 167, 69, 0.6), 0 0 80px rgba(40, 167, 69, 0.3);
          animation: pulseGlow 1.5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 40px rgba(40, 167, 69, 0.6), 0 0 80px rgba(40, 167, 69, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 60px rgba(40, 167, 69, 0.8), 0 0 120px rgba(40, 167, 69, 0.4);
          }
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

        /* Confetes explosão */
        .confetti-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 5;
        }

        .confetti {
          position: absolute;
          width: var(--size);
          height: var(--size);
          background: var(--color);
          animation: confettiBurst var(--duration) ease-out var(--delay) forwards;
          transform-origin: center;
          opacity: 0;
          border-radius: 3px;
        }

        @keyframes confettiBurst {
          0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform:
              translate(
                calc(cos(var(--angle)) * 250px),
                calc(sin(var(--angle)) * 250px)
              )
              scale(1.5)
              rotate(var(--rotation));
            opacity: 0;
          }
        }

        /* Confetes caindo */
        .confetti-rain {
          position: absolute;
          top: -50px;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 4;
        }

        .confetti-piece {
          position: absolute;
          left: var(--x-pos);
          width: 12px;
          height: 12px;
          background: var(--color);
          animation: confettiFall var(--duration) ease-in var(--delay) forwards;
          opacity: 0;
          border-radius: 3px;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(var(--rotation));
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
