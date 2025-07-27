import { useAuth } from '@/modules/auth/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      {/* Welcome Section */}
      <div className="app-card app-card-large text-center">
        <h1 className="app-title-h1">
          Bem-vindo(a), {user?.nomeCompleto}!
        </h1>
        <p className="app-text-body">
          Este é seu portal Madrilusa. Aqui pode gerir as suas informações pessoais.
        </p>
        <div className="app-text-secondary">
          Membro desde {new Date(user?.createdAt || '').toLocaleDateString('pt-PT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 