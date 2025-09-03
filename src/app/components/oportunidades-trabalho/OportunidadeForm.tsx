import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardBody,
  CardHeader,
  FormGroup, 
  FormInput, 
  FormSelect,
  FormTextarea,
  Button,
  Row,
  Col,
  Collapse
} from 'shards-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import ArrayField from './ArrayField';
import IdiomaField from './IdiomaField';
import type { 
  OportunidadeFormData,
  ContribuicaoUnificada,
  OportunidadeTrabalho,
  IdiomaOportunidade
} from '../../../types/oportunidades-trabalho.types';
import { 
  OPCOES_GENERO_OPORTUNIDADE,
  OPCOES_BINARIAS_OPORTUNIDADE,
  NIVEIS_ESCOLARIDADE_OPORTUNIDADE
} from '../../../types/oportunidades-trabalho.types';

interface OportunidadeFormProps {
  onSubmit: (data: OportunidadeFormData) => void;
  editingOportunidade?: ContribuicaoUnificada | null;
  loading?: boolean;
}

const OportunidadeForm: React.FC<OportunidadeFormProps> = ({ 
  onSubmit, 
  editingOportunidade, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<OportunidadeFormData>({
    titulo: '',
    nomeCargo: '',
    nomeProfissao: '',
    descricaoCargo: '',
    genero: 'INDIFERENTE',
    idade: '',
    municipioResidencia: '',
    transporteProprio: 'INDIFERENTE',
    fluenciaPortugues: 'INDIFERENTE',
    nivelEscolaridade: 'Indiferente',
    denominacoes: [''],
    experienciasAceitas: [''],
    areasFormacao: [''],
    idiomasPreferenciais: [{ idioma: '', nivel: 'Básico' }],
    habilidades: [''],
    caracteristicas: ['']
  });

  const [openSections, setOpenSections] = useState({
    basicas: true,
    criterios: false,
    experiencia: false,
    formacao: false,
    idiomas: false,
    competencias: false
  });

  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar dados para edição
  useEffect(() => {
    if (editingOportunidade && editingOportunidade.tipo === 'oportunidade_trabalho') {
      const oportunidade = editingOportunidade.dadosEstruturados as OportunidadeTrabalho;
      
      setFormData({
        titulo: oportunidade.titulo,
        nomeCargo: oportunidade.nomeCargo,
        nomeProfissao: oportunidade.nomeProfissao || '',
        descricaoCargo: oportunidade.descricaoCargo || '',
        genero: oportunidade.genero || 'INDIFERENTE',
        idade: oportunidade.idade || '',
        municipioResidencia: oportunidade.municipioResidencia || '',
        transporteProprio: oportunidade.transporteProprio || 'INDIFERENTE',
        fluenciaPortugues: oportunidade.fluenciaPortugues || 'INDIFERENTE',
        nivelEscolaridade: oportunidade.nivelEscolaridade || 'Indiferente',
        denominacoes: oportunidade.denominacoes || [''],
        experienciasAceitas: oportunidade.experienciasAceitas || [''],
        areasFormacao: oportunidade.areasFormacao || [''],
        idiomasPreferenciais: oportunidade.idiomasPreferenciais || [{ idioma: '', nivel: 'Básico' }],
        habilidades: oportunidade.habilidades || [''],
        caracteristicas: oportunidade.caracteristicas || ['']
      });
    }
  }, [editingOportunidade]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFormData = (field: keyof OportunidadeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nomeCargo.trim()) {
      toast({
        title: "Erro", 
        description: "Nome do cargo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Filtrar arrays vazios
    const dataToSubmit: OportunidadeFormData = {
      ...formData,
      denominacoes: formData.denominacoes.filter(d => d.trim() !== ''),
      experienciasAceitas: formData.experienciasAceitas.filter(e => e.trim() !== ''),
      areasFormacao: formData.areasFormacao.filter(a => a.trim() !== ''),
      idiomasPreferenciais: formData.idiomasPreferenciais.filter(i => i.idioma.trim() !== ''),
      habilidades: formData.habilidades.filter(h => h.trim() !== ''),
      caracteristicas: formData.caracteristicas.filter(c => c.trim() !== '')
    };

    onSubmit(dataToSubmit);
  };

  const getSectionIcon = (section: keyof typeof openSections) => {
    return openSections[section] ? 'expand_less' : 'expand_more';
  };

  const getSectionColor = (section: keyof typeof openSections) => {
    return openSections[section] ? 'primary' : 'secondary';
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Seção 1: Informações Básicas */}
      <Card className="mb-3">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('basicas')}
          style={{ backgroundColor: openSections.basicas ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">business_center</i>
              Informações Básicas
            </h6>
            <i className={`material-icons text-${getSectionColor('basicas')}`}>
              {getSectionIcon('basicas')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.basicas}>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="titulo">
                    Título da Oportunidade <span className="text-danger">*</span>
                  </label>
                  <FormInput
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => updateFormData('titulo', e.target.value)}
                    placeholder="Ex: Desenvolvedor Frontend - React"
                    required
                  />
                  <small className="text-muted">
                    Como a oportunidade aparecerá na listagem
                  </small>
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="nomeCargo">
                    Nome do Cargo <span className="text-danger">*</span>
                  </label>
                  <FormInput
                    id="nomeCargo"
                    value={formData.nomeCargo}
                    onChange={(e) => updateFormData('nomeCargo', e.target.value)}
                    placeholder="Ex: Desenvolvedor Frontend"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="nomeProfissao">Nome da Profissão</label>
                  <FormInput
                    id="nomeProfissao"
                    value={formData.nomeProfissao}
                    onChange={(e) => updateFormData('nomeProfissao', e.target.value)}
                    placeholder="Ex: Programador, Designer..."
                  />
                  <small className="text-muted">
                    Categoria profissional geral (opcional)
                  </small>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <label htmlFor="descricaoCargo">Descrição do Cargo</label>
              <FormTextarea
                id="descricaoCargo"
                value={formData.descricaoCargo}
                onChange={(e) => updateFormData('descricaoCargo', e.target.value)}
                placeholder="Descreva as principais responsabilidades, ambiente de trabalho, benefícios..."
                rows={4}
              />
            </FormGroup>

            <ArrayField
              label="Denominações Alternativas"
              values={formData.denominacoes}
              onChange={(values) => updateFormData('denominacoes', values)}
              placeholder="Ex: Frontend Developer, Programador Web"
              maxItems={5}
              helpText="Outros nomes que este cargo pode ter em diferentes empresas ou idiomas"
            />
          </CardBody>
        </Collapse>
      </Card>

      {/* Seção 2: Critérios Demográficos */}
      <Card className="mb-3">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('criterios')}
          style={{ backgroundColor: openSections.criterios ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">person</i>
              Critérios Demográficos
            </h6>
            <i className={`material-icons text-${getSectionColor('criterios')}`}>
              {getSectionIcon('criterios')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.criterios}>
          <CardBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <label htmlFor="genero">Género</label>
                  <FormSelect
                    id="genero"
                    value={formData.genero}
                    onChange={(e) => updateFormData('genero', e.target.value)}
                  >
                    {OPCOES_GENERO_OPORTUNIDADE.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao === 'F' ? 'Feminino' : opcao === 'M' ? 'Masculino' : 'Indiferente'}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <label htmlFor="idade">Faixa Etária</label>
                  <FormInput
                    id="idade"
                    value={formData.idade}
                    onChange={(e) => updateFormData('idade', e.target.value)}
                    placeholder="Ex: 18-35 anos, Acima de 25"
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <label htmlFor="municipioResidencia">Município de Residência</label>
                  <FormInput
                    id="municipioResidencia"
                    value={formData.municipioResidencia}
                    onChange={(e) => updateFormData('municipioResidencia', e.target.value)}
                    placeholder="Ex: Lisboa, Porto..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="transporteProprio">Transporte Próprio</label>
                  <FormSelect
                    id="transporteProprio"
                    value={formData.transporteProprio}
                    onChange={(e) => updateFormData('transporteProprio', e.target.value)}
                  >
                    {OPCOES_BINARIAS_OPORTUNIDADE.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao === 'S' ? 'Sim (obrigatório)' : opcao === 'N' ? 'Não (dispensável)' : 'Indiferente'}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <label htmlFor="fluenciaPortugues">Fluência em Português</label>
                  <FormSelect
                    id="fluenciaPortugues"
                    value={formData.fluenciaPortugues}
                    onChange={(e) => updateFormData('fluenciaPortugues', e.target.value)}
                  >
                    {OPCOES_BINARIAS_OPORTUNIDADE.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao === 'S' ? 'Sim (obrigatório)' : opcao === 'N' ? 'Não (dispensável)' : 'Indiferente'}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Collapse>
      </Card>

      {/* Seção 3: Experiência Profissional */}
      <Card className="mb-3">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('experiencia')}
          style={{ backgroundColor: openSections.experiencia ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">work</i>
              Experiência Profissional
            </h6>
            <i className={`material-icons text-${getSectionColor('experiencia')}`}>
              {getSectionIcon('experiencia')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.experiencia}>
          <CardBody>
            <ArrayField
              label="Experiências Aceitas"
              values={formData.experienciasAceitas}
              onChange={(values) => updateFormData('experienciasAceitas', values)}
              placeholder="Ex: Desenvolvimento web, React, Projetos pessoais"
              maxItems={8}
              helpText="Tipos de experiência que considera relevantes para este cargo"
            />
          </CardBody>
        </Collapse>
      </Card>

      {/* Seção 4: Formação */}
      <Card className="mb-3">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('formacao')}
          style={{ backgroundColor: openSections.formacao ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">school</i>
              Formação
            </h6>
            <i className={`material-icons text-${getSectionColor('formacao')}`}>
              {getSectionIcon('formacao')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.formacao}>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <label htmlFor="nivelEscolaridade">Nível de Escolaridade Mínimo</label>
                  <FormSelect
                    id="nivelEscolaridade"
                    value={formData.nivelEscolaridade}
                    onChange={(e) => updateFormData('nivelEscolaridade', e.target.value)}
                  >
                    {NIVEIS_ESCOLARIDADE_OPORTUNIDADE.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </Col>
            </Row>

            <ArrayField
              label="Áreas de Formação"
              values={formData.areasFormacao}
              onChange={(values) => updateFormData('areasFormacao', values)}
              placeholder="Ex: Engenharia Informática, Design, Marketing"
              maxItems={6}
              helpText="Áreas de formação que considera relevantes para este cargo"
            />
          </CardBody>
        </Collapse>
      </Card>

      {/* Seção 5: Idiomas */}
      <Card className="mb-3">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('idiomas')}
          style={{ backgroundColor: openSections.idiomas ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">language</i>
              Idiomas Preferenciais
            </h6>
            <i className={`material-icons text-${getSectionColor('idiomas')}`}>
              {getSectionIcon('idiomas')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.idiomas}>
          <CardBody>
            <IdiomaField
              label="Idiomas Desejados"
              idiomas={formData.idiomasPreferenciais}
              onChange={(idiomas) => updateFormData('idiomasPreferenciais', idiomas)}
              maxItems={4}
              helpText="Idiomas que considera importantes para este cargo"
            />
          </CardBody>
        </Collapse>
      </Card>

      {/* Seção 6: Competências e Personalidade */}
      <Card className="mb-4">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('competencias')}
          style={{ backgroundColor: openSections.competencias ? '#e3f2fd' : '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="material-icons mr-2">psychology</i>
              Competências e Personalidade
            </h6>
            <i className={`material-icons text-${getSectionColor('competencias')}`}>
              {getSectionIcon('competencias')}
            </i>
          </div>
        </CardHeader>
        
        <Collapse open={openSections.competencias}>
          <CardBody>
            <ArrayField
              label="Habilidades Desejadas"
              values={formData.habilidades}
              onChange={(values) => updateFormData('habilidades', values)}
              placeholder="Ex: React, Photoshop, Trabalho em equipa"
              maxItems={8}
              helpText="Competências técnicas ou soft skills importantes para o cargo"
            />

            <ArrayField
              label="Características de Personalidade"
              values={formData.caracteristicas}
              onChange={(values) => updateFormData('caracteristicas', values)}
              placeholder="Ex: Proativo, Criativo, Comunicativo"
              maxItems={6}
              helpText="Traços de personalidade que valoriza no candidato ideal"
            />
          </CardBody>
        </Collapse>
      </Card>

      {/* Botões de Ação */}
      <div className="d-flex justify-content-end">
        <Button 
          type="submit" 
          theme="primary"
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <i className="material-icons mr-1">save</i>
              {editingOportunidade ? 'Atualizar' : 'Publicar'} Oportunidade
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default OportunidadeForm;
