import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button
} from 'shards-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PerfilImigrante } from '@/modules/auth/types/auth.types';

interface ImigranteDetailsProps {
  title?: string;
}

const ImigranteDetails: React.FC<ImigranteDetailsProps> = ({
  title = "Perfil de Imigrante"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nacionalidades, setNacionalidades] = useState<string[]>([]);
  const [showNacionalidades, setShowNacionalidades] = useState(false);
  const nacionalidadeRef = useRef<HTMLDivElement>(null);

  const [perfilData, setPerfilData] = useState<PerfilImigrante | null>(null);
  const [formData, setFormData] = useState({
    nacionalidade: '',
    dataNascimento: '',
    objetivos: [] as string[], // Array de objetivos selecionados
    objetivoOutros: '',
    mensagem: '',
    aceitaNotificacoes: false, // Aceita receber notificações
    
    // ✨ NOVOS CAMPOS - Informações Adicionais
    genero: '',
    municipioResidencia: '',
    transporteProprio: false,
    possibilidadeMudancaMorada: false,
    fluenciaPortugues: ''
  });

  // Buscar nacionalidades disponíveis
  useEffect(() => {
    const fetchNacionalidades = async () => {
      try {
        const response = await fetch('/api/imigrantes/nacionalidades');
        const result = await response.json();
        if (result.success) {
          setNacionalidades(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar nacionalidades:', error);
      }
    };

    fetchNacionalidades();
  }, []);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nacionalidadeRef.current && !nacionalidadeRef.current.contains(event.target as Node)) {
        setShowNacionalidades(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Buscar perfil do imigrante
  useEffect(() => {
    const fetchPerfilImigrante = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/imigrantes/perfil/${user.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const perfil = result.data;
          setPerfilData(perfil);
          
          // Formatar data para input
          const dataFormatada = perfil.dataNascimento 
            ? new Date(perfil.dataNascimento).toISOString().split('T')[0]
            : '';

          setFormData({
            nacionalidade: perfil.nacionalidade || '',
            dataNascimento: dataFormatada,
            objetivos: perfil.objetivos || [],
            objetivoOutros: perfil.objetivoOutros || '',
            mensagem: perfil.mensagem || '',
            aceitaNotificacoes: perfil.aceitaNotificacoes || false,
            
            // ✨ NOVOS CAMPOS - Informações Adicionais
            genero: perfil.genero || '',
            municipioResidencia: perfil.municipioResidencia || '',
            transporteProprio: perfil.transporteProprio || false,
            possibilidadeMudancaMorada: perfil.possibilidadeMudancaMorada || false,
            fluenciaPortugues: perfil.fluenciaPortugues || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil de imigrante:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar perfil de imigrante.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerfilImigrante();
  }, [user?.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObjetivoChange = (objetivo: string) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.includes(objetivo)
        ? prev.objetivos.filter(obj => obj !== objetivo)
        : [...prev.objetivos, objetivo]
    }));
  };

  const handleNotificacoesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      aceitaNotificacoes: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const dataToSend = {
        ...formData,
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : undefined
      };

      const url = perfilData 
        ? `/api/imigrantes/perfil/${user.id}` 
        : `/api/imigrantes/perfil`;
      
      const method = perfilData ? 'PUT' : 'POST';
      
      if (!perfilData) {
        (dataToSend as any).userId = user.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setPerfilData(result.data);
        toast({
          title: "Sucesso",
          description: perfilData ? "Perfil atualizado com sucesso!" : "Perfil criado com sucesso!",
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar perfil');
      }
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <div className="text-center">Carregando...</div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }

  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="nacionalidade">Nacionalidade *</label>
                  <div ref={nacionalidadeRef} style={{ position: 'relative' }}>
                    <FormInput
                      id="nacionalidade"
                      name="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={handleInputChange}
                      onFocus={() => setShowNacionalidades(true)}
                      required
                      placeholder="Digite ou selecione sua nacionalidade"
                      autoComplete="off"
                      style={{ paddingRight: '30px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowNacionalidades(!showNacionalidades);
                        // Se estiver abrindo e o campo estiver vazio, garantir que mostre todas
                        if (!showNacionalidades && formData.nacionalidade === '') {
                          // Força re-render para mostrar todas as opções
                          setFormData(prev => ({ ...prev, nacionalidade: '' }));
                        }
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#666'
                      }}
                      aria-label="Mostrar opções"
                    >
                      ▼
                    </button>
                    {showNacionalidades && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          zIndex: 1000,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {nacionalidades
                          .filter(pais => 
                            formData.nacionalidade === '' || 
                            pais.toLowerCase().includes(formData.nacionalidade.toLowerCase())
                          )
                          .map((pais) => (
                            <div
                              key={pais}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, nacionalidade: pais }));
                                setShowNacionalidades(false);
                              }}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee'
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLDivElement).style.backgroundColor = '#f5f5f5';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLDivElement).style.backgroundColor = 'white';
                              }}
                            >
                              {pais}
                            </div>
                          ))}
                        {nacionalidades.filter(pais => 
                          formData.nacionalidade === '' || 
                          pais.toLowerCase().includes(formData.nacionalidade.toLowerCase())
                        ).length === 0 && (
                          <div style={{ padding: '8px 12px', color: '#999' }}>
                            Nenhuma nacionalidade encontrada
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="dataNascimento">Data de Nascimento *</label>
                  <FormInput
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Objetivos *</label>
                  <div style={{ marginTop: '10px' }}>
                    {[
                      {
                        value: 'Emprego',
                        label: 'Emprego',
                        description: 'Encontrar ofertas de trabalho que se adequem ao teu perfil; Receber apoio para desenvolvimento do currículo, procura ativa de oportunidades e preparação para entrevistas; entre outras'
                      },
                      {
                        value: 'Formação',
                        label: 'Formação',
                        description: 'Receber informação sobre cursos em várias áreas como: Informática, Português Língua de Acolhimento, Empreendedorismo, Geriatria, entre outras'
                      },
                      {
                        value: 'LusoAcademia',
                        label: 'LusoAcademia',
                        description: 'Receber informação e inscrever-te em atividades artísticas e culturais como clubes de leitura, aulas de artes, workshops de gastronomia, aulas de pilates, visitas em grupo a cidades próximas e feiras culturais'
                      },
                      {
                        value: 'Social',
                        label: 'Social',
                        description: 'Pedir informação e encaminhamento para questões relacionadas com regularização, alojamento, transporte, acesso ao sistema de saúde, entre outras'
                      }
                    ].map((objetivo) => (
                      <div key={objetivo.value} style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', fontWeight: 'normal', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.objetivos.includes(objetivo.value)}
                            onChange={() => handleObjetivoChange(objetivo.value)}
                            style={{ marginRight: '8px', marginTop: '3px', flexShrink: 0 }}
                          />
                          <div>
                            <strong>{objetivo.label}</strong>
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
                              {objetivo.description}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="objetivoOutros">Outros Objetivos</label>
                  <FormTextarea
                    id="objetivoOutros"
                    name="objetivoOutros"
                    rows={3}
                    value={formData.objetivoOutros}
                    onChange={handleInputChange}
                    placeholder="Outros objetivos ou necessidades específicas"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="mensagem">Mensagem Adicional</label>
                  <FormTextarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais que gostaria de compartilhar"
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* ✨ NOVOS CAMPOS - Informações Adicionais */}
            <Row>
              <Col md="12">
                <h5 style={{ borderTop: '1px solid #dee2e6', paddingTop: '20px', marginTop: '20px', marginBottom: '20px' }}>
                  Informações Adicionais
                </h5>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="genero">Género</label>
                  <FormSelect
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Selecione o género</option>
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                    <option value="Outro">Outro</option>
                  </FormSelect>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label htmlFor="fluenciaPortugues">Fluência em Português</label>
                  <FormSelect
                    id="fluenciaPortugues"
                    name="fluenciaPortugues"
                    value={formData.fluenciaPortugues}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Selecione o nível</option>
                    <option value="Básica">Básica</option>
                    <option value="Intermediária">Intermediária</option>
                    <option value="Avançada">Avançada</option>
                    <option value="Fluente">Fluente</option>
                  </FormSelect>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <label htmlFor="municipioResidencia">Município de Residência</label>
                  <FormInput
                    id="municipioResidencia"
                    name="municipioResidencia"
                    value={formData.municipioResidencia}
                    onChange={handleInputChange}
                    placeholder="Digite o município onde reside"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                      <input
                        type="checkbox"
                        name="transporteProprio"
                        checked={formData.transporteProprio}
                        onChange={(e) => setFormData(prev => ({ ...prev, transporteProprio: e.target.checked }))}
                        style={{ marginRight: '8px' }}
                      />
                      Tenho transporte próprio
                    </label>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                      <input
                        type="checkbox"
                        name="possibilidadeMudancaMorada"
                        checked={formData.possibilidadeMudancaMorada}
                        onChange={(e) => setFormData(prev => ({ ...prev, possibilidadeMudancaMorada: e.target.checked }))}
                        style={{ marginRight: '8px' }}
                      />
                      Possibilidade de mudança de morada
                    </label>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                      <input
                        type="checkbox"
                        checked={formData.aceitaNotificacoes}
                        onChange={handleNotificacoesChange}
                        style={{ marginRight: '8px' }}
                      />
                      Aceito receber notificações de oportunidades, notícias e eventos
                    </label>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12" className="text-right">
                <Button
                  type="submit"
                  theme="primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : perfilData ? "Atualizar Perfil" : "Criar Perfil"}
                </Button>
              </Col>
            </Row>
          </Form>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default ImigranteDetails; 