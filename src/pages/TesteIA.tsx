import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'shards-react';
import AITextEnhancer from '@/components/ai/AITextEnhancer';
import AITagSuggester from '@/components/ai/AITagSuggester';

const TesteIA: React.FC = () => {
  const [texto, setTexto] = useState('Sou desenvolvedor full-stack com experiência em React e Node.js. Procuro oportunidades em Portugal.');
  const [tags, setTags] = useState<string[]>(['JavaScript']);

  const aiContext = {
    platformContext: "Plataforma Madrilusa para integração de jovens imigrantes",
    userCategory: "IMIGRANTE",
    contributionType: "Habilidades",
    typeContext: "Foque em competências profissionais e pessoais",
    specificGuidance: "Que habilidades possui? Em que áreas tem experiência?",
    tone: "profissional mas acessível",
    focus: "relevância para integração social em Portugal",
    maxLength: 1000,
    additionalGuidelines: "Use linguagem inclusiva"
  };

  const mockExistingTags = [
    { id: '1', nome: 'React', cor: '#61dafb', categoria: 'Tecnologia', usos: 15 },
    { id: '2', nome: 'Node.js', cor: '#68a063', categoria: 'Tecnologia', usos: 12 },
    { id: '3', nome: 'JavaScript', cor: '#f7df1e', categoria: 'Tecnologia', usos: 20 },
    { id: '4', nome: 'Frontend', cor: '#007bff', categoria: 'Área', usos: 8 },
    { id: '5', nome: 'Backend', cor: '#28a745', categoria: 'Área', usos: 6 }
  ];

  return (
    <Container fluid className="main-content-container px-4">
      <Row>
        <Col>
          <h1>🧪 Teste de IA - Madrilusa</h1>
          <p>Página de teste para validar funcionalidades de IA</p>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <Card>
            <CardBody>
              <h5>📝 Teste de Aprimoramento de Texto</h5>
              
              <div className="form-group">
                <label>Texto Original:</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={texto}
                  onChange={(e) => {
                    console.log('🔧 TESTE: Atualizando texto via onChange:', e.target.value.substring(0, 50) + '...');
                    setTexto(e.target.value);
                  }}
                  placeholder="Digite seu texto aqui..."
                />
                <small className="text-muted">{texto.length} caracteres</small>
              </div>

              <AITextEnhancer
                originalText={texto}
                onTextChanged={(newText) => {
                  console.log('🔧 TESTE: onTextChanged chamado:', {
                    novoTexto: newText.substring(0, 50) + '...',
                    textoAnterior: texto.substring(0, 50) + '...',
                    tamanhoNovo: newText.length,
                    tamanhoAnterior: texto.length
                  });
                  setTexto(newText);
                  console.log('🔧 TESTE: setTexto executado');
                }}
                context={aiContext}
                disabled={false}
              />

              <div className="mt-3 p-2 bg-light rounded">
                <small><strong>Estado Atual:</strong></small>
                <pre style={{fontSize: '10px', maxHeight: '100px', overflow: 'auto'}}>
                  {JSON.stringify({ texto: texto.substring(0, 100) + '...', tamanho: texto.length }, null, 2)}
                </pre>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <CardBody>
              <h5>🏷️ Teste de Sugestão de Tags</h5>
              
              <div className="form-group">
                <label>Tags Selecionadas:</label>
                <div className="mb-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="badge badge-primary mr-1 mb-1">
                      {tag}
                      <button
                        type="button"
                        className="btn btn-sm p-0 ml-1"
                        style={{ color: '#fff', background: 'none', border: 'none' }}
                        onClick={() => {
                          console.log('🔧 TESTE: Removendo tag:', tag);
                          setTags(tags.filter(t => t !== tag));
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <AITagSuggester
                text={texto}
                context={aiContext}
                selectedTags={tags}
                onTagsChanged={(newTags) => {
                  console.log('🔧 TESTE: onTagsChanged chamado:', {
                    novasTags: newTags,
                    tagsAnteriores: tags,
                    diferenca: newTags.length - tags.length
                  });
                  setTags(newTags);
                  console.log('🔧 TESTE: setTags executado');
                }}
                existingTags={mockExistingTags}
                disabled={false}
                maxTags={8}
              />

              <div className="mt-3 p-2 bg-light rounded">
                <small><strong>Estado Atual:</strong></small>
                <pre style={{fontSize: '10px', maxHeight: '100px', overflow: 'auto'}}>
                  {JSON.stringify({ tags, quantidade: tags.length }, null, 2)}
                </pre>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <h5>🔧 Debug - Estado Completo</h5>
              <Button 
                theme="primary" 
                onClick={() => {
                  console.log('🔧 TESTE: Estado completo:', { texto, tags });
                  alert(`Texto: ${texto.length} chars\nTags: ${tags.length} items\n\n${JSON.stringify({ texto: texto.substring(0, 100), tags }, null, 2)}`);
                }}
              >
                Mostrar Estado Atual
              </Button>
              
              <Button 
                theme="secondary" 
                className="ml-2"
                onClick={() => {
                  console.log('🔧 TESTE: Resetando estado');
                  setTexto('Texto de teste para verificar atualizações');
                  setTags(['Teste']);
                }}
              >
                Reset Estado
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TesteIA;
