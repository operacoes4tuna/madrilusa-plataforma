import { useAuth } from '@/modules/auth/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="app-card text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--app-primary)' }}>
          Bem-vindo(a), {user?.nomeCompleto}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Este é seu portal Madrilusa. Aqui você pode gerenciar suas informações pessoais.
        </p>
        <div className="text-sm text-gray-500">
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