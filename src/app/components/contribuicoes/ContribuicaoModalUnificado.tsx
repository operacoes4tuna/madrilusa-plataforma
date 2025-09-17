import React, { useState } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button 
} from 'shards-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ContribuicaoModal from './ContribuicaoModal';
import ExperienciaForm from '../dados-profissionais/ExperienciaForm';
import FormacaoForm from '../dados-profissionais/FormacaoForm';
import IdiomaForm from '../dados-profissionais/IdiomaForm';
import type { 
  ModalTipo,
  ContribuicaoUnificada,
  ExperienciaFormData,
  FormacaoFormData,
  IdiomaFormData
} from '../../../../types/dados-profissionais.types';
import type { OportunidadeFormData } from '../../../types/oportunidades-trabalho.types';
import OportunidadeForm from '../oportunidades-trabalho/OportunidadeForm';

interface ContribuicaoModalUnificadoProps {
  isOpen: boolean;
  tipo: ModalTipo;
  onClose: () => void;
  onSave: () => void;
  editingData?: ContribuicaoUnificada | null;
  tiposDisponiveis?: any[];
}

const ContribuicaoModalUnificado: React.FC<ContribuicaoModalUnificadoProps> = ({ 
  isOpen, 
  tipo, 
  onClose, 
  onSave,
  editingData,
  tiposDisponiveis = []
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getModalTitle = () => {
    if (editingData) {
      switch (tipo) {
        case 'normal': return 'Editar Contribuição';
        case 'experiencia': return 'Editar Experiência Profissional';
        case 'formacao': return 'Editar Formação';
        case 'idioma': return 'Editar Idioma';
        case 'oportunidade_trabalho': return 'Editar Oportunidade de Trabalho';
        default: return 'Editar';
      }
    } else {
      switch (tipo) {
        case 'normal': return 'Nova Habilidade/Objetivo';
        case 'experiencia': return 'Nova Experiência Profissional';
        case 'formacao': return 'Nova Formação';
        case 'idioma': return 'Novo Idioma';
        case 'oportunidade_trabalho': return 'Nova Oportunidade de Trabalho';
        default: return 'Novo';
      }
    }
  };

  const getModalSize = () => {
    return tipo === 'normal' ? 'lg' : 'xl';
  };

  const handleExperienciaSubmit = async (data: ExperienciaFormData) => {
    setLoading(true);
    
    try {
      // Se está editando, atualizar apenas uma experiência
      if (editingData) {
        const response = await fetch(`/api/dados-profissionais/dado/${editingData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            dados: data.experiencias[0]
          })
        });

        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Experiência atualizada com sucesso",
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        // Criar múltiplas experiências
        const promises = data.experiencias.map((exp, index) =>
          fetch(`/api/dados-profissionais/user/${user?.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipo: 'experiencia',
              dados: exp,
              ordem: index + 1
            })
          })
        );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
          throw new Error(failed[0].error);
        }

        toast({
          title: "Sucesso",
          description: `${data.experiencias.length} experiência${data.experiencias.length > 1 ? 's' : ''} adicionada${data.experiencias.length > 1 ? 's' : ''} com sucesso`,
        });
      }

      onSave();
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar experiência:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar experiência",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormacaoSubmit = async (data: FormacaoFormData) => {
    setLoading(true);
    
    try {
      if (editingData) {
        const response = await fetch(`/api/dados-profissionais/dado/${editingData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            dados: data.formacoes[0]
          })
        });

        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Formação atualizada com sucesso",
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        const promises = data.formacoes.map((form, index) =>
          fetch(`/api/dados-profissionais/user/${user?.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipo: 'formacao',
              dados: form,
              ordem: index + 1
            })
          })
        );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
          throw new Error(failed[0].error);
        }

        toast({
          title: "Sucesso",
          description: `${data.formacoes.length} formação${data.formacoes.length > 1 ? 'ões' : ''} adicionada${data.formacoes.length > 1 ? 's' : ''} com sucesso`,
        });
      }

      onSave();
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar formação:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar formação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIdiomaSubmit = async (data: IdiomaFormData) => {
    setLoading(true);
    
    try {
      if (editingData) {
        const response = await fetch(`/api/dados-profissionais/dado/${editingData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            dados: data.idiomas[0]
          })
        });

        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Idioma atualizado com sucesso",
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        const promises = data.idiomas.map((idioma, index) =>
          fetch(`/api/dados-profissionais/user/${user?.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tipo: 'idioma',
              dados: idioma,
              ordem: index + 1
            })
          })
        );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
          throw new Error(failed[0].error);
        }

        toast({
          title: "Sucesso",
          description: `${data.idiomas.length} idioma${data.idiomas.length > 1 ? 's' : ''} adicionado${data.idiomas.length > 1 ? 's' : ''} com sucesso`,
        });
      }

      onSave();
      onClose();
      
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar idioma",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (tipo) {
      case 'normal':
        return (
          <ContribuicaoModal
            isOpen={false} // Controlado pelo modal pai
            onClose={() => {}}
            onSave={onSave}
            editingContribuicao={editingData as any}
            tiposDisponiveis={tiposDisponiveis}
          />
        );
      case 'experiencia':
        return (
          <ExperienciaForm
            onSubmit={handleExperienciaSubmit}
            editingData={editingData}
            loading={loading}
          />
        );
      case 'formacao':
        return (
          <FormacaoForm
            onSubmit={handleFormacaoSubmit}
            editingData={editingData}
            loading={loading}
          />
        );
      case 'idioma':
        return (
          <IdiomaForm
            onSubmit={handleIdiomaSubmit}
            editingData={editingData}
            loading={loading}
          />
        );
      default:
        return <div>Tipo não reconhecido</div>;
    }
  };

  if (tipo === 'normal') {
    // Para contribuições normais, usar o modal existente
    return (
      <ContribuicaoModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={onSave}
        editingContribuicao={editingData as any}
        tiposDisponiveis={tiposDisponiveis}
      />
    );
  }

  return (
    <Modal open={isOpen} toggle={onClose} size={getModalSize()}>
      <ModalHeader>
        {getModalTitle()}
      </ModalHeader>
      
      <ModalBody>
        {renderForm()}
      </ModalBody>
      
      <ModalFooter>
        <Button theme="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContribuicaoModalUnificado;
