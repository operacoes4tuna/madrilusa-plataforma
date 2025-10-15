import React, { useState, useRef } from 'react';
import { Button } from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getUserPhotoUrl } from '@/lib/userPhotoUtils';

interface PhotoUploadProps {
  onPhotoUploaded?: (photoUrl: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUploaded }) => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload automático
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('foto', file);

      console.log('Enviando upload para:', `/api/users/${user.id}/upload-photo`);
      
      const response = await fetch(`/api/users/${user.id}/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      console.log('Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(`Erro ao fazer upload da foto: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resultado do upload:', result);

      if (result.success && result.data) {
        // Atualizar contexto do usuário
        setUser(result.data);
        localStorage.setItem('madrilusa_user', JSON.stringify(result.data));

        // Limpar preview local
        setPreviewUrl(null);

        // Callback para componente pai
        if (onPhotoUploaded) {
          onPhotoUploaded(result.data.foto);
        }

        toast({
          title: "Foto actualizada com sucesso!",
          description: "A sua foto de perfil foi alterada.",
        });

        // Force reload da página para atualizar todas as imagens
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro ao enviar foto",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;

    setIsUploading(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foto: null }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover foto');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Atualizar contexto do usuário
        setUser(result.data);
        localStorage.setItem('madrilusa_user', JSON.stringify(result.data));
        setPreviewUrl(null);

        // Callback para componente pai
        if (onPhotoUploaded) {
          onPhotoUploaded('');
        }

        toast({
          title: "Foto removida com sucesso!",
          description: "A sua foto de perfil foi removida.",
        });
      }
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro ao remover foto",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getCurrentPhotoUrl = () => {
    if (previewUrl) return previewUrl;
    return getUserPhotoUrl(user);
  };

  return (
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block mb-3">
        <img
          src={getCurrentPhotoUrl()}
          alt="Foto do perfil"
          className="rounded-circle"
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            border: '3px solid #F5A623'
          }}
        />
        
        {isUploading && (
          <div 
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white'
            }}
          >
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">A carregar...</span>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ 
            backgroundColor: '#F5A623', 
            borderColor: '#F5A623',
            marginRight: '8px'
          }}
          size="sm"
        >
          {isUploading ? 'A enviar...' : 'Alterar Foto'}
        </Button>
        
        {user?.foto && (
          <Button
            onClick={handleRemovePhoto}
            outline
            theme="danger"
            size="sm"
            disabled={isUploading}
          >
            Remover
          </Button>
        )}
      </div>
      
      <small className="text-muted d-block mt-2">
        PNG, JPG até 5MB
      </small>
    </div>
  );
};

export default PhotoUpload; 