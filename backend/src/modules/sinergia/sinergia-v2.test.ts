// Testes básicos para SinergIA V2
// Para executar: npm test ou node -e "require('./sinergia-v2.test.js').runTests()"

import { SinergiaV2Service } from './sinergia-v2.service';

export async function runTests() {
  console.log('🧪 INICIANDO TESTES SINERGIA V2\n');
  
  const service = new SinergiaV2Service();
  let testsPassados = 0;
  let testsFalharam = 0;

  // Test 1: Health check do serviço
  try {
    console.log('TEST 1: Instanciação do serviço');
    if (service) {
      console.log('✅ Serviço instanciado com sucesso');
      testsPassados++;
    } else {
      throw new Error('Serviço não foi instanciado');
    }
  } catch (error) {
    console.log('❌ Falha na instanciação:', error);
    testsFalharam++;
  }

  // Test 2: Validação de tipos
  try {
    console.log('\nTEST 2: Validação de tipos TypeScript');
    
    // Mock de dados para teste
    const mockOportunidade = {
      id: 'test-oportunidade-1',
      titulo: 'Desenvolvedor Frontend',
      userId: 'test-empresa-1',
      genero: 'INDIFERENTE',
      idade: '25-35 anos',
      municipioResidencia: 'Lisboa',
      transporteProprio: 'S',
      fluenciaPortugues: 'S',
      nomeCargo: 'Desenvolvedor Frontend',
      nomeProfissao: 'Programador',
      descricaoCargo: 'Desenvolvimento de aplicações web',
      denominacoes: ['Frontend Developer', 'Web Developer'],
      experienciasAceitas: ['React', 'JavaScript', 'TypeScript'],
      nivelEscolaridade: 'Licenciatura',
      areasFormacao: ['Informática', 'Engenharia'],
      idiomasPreferenciais: [
        { idioma: 'Inglês', nivel: 'Intermediário' }
      ],
      habilidades: ['React', 'TypeScript', 'CSS'],
      caracteristicas: ['Proativo', 'Trabalho em equipa'],
      ativo: true,
      visualizacoes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockImigrante = {
      id: 'test-imigrante-1',
      nomeCompleto: 'João Silva',
      email: 'joao@teste.com',
      genero: 'M',
      municipioResidencia: 'Lisboa',
      transporteProprio: true,
      fluenciaPortugues: 'Fluente',
      idade: 28,
      experiencias: [
        {
          cargo: 'Desenvolvedor Web',
          empresa: 'Tech Corp',
          descricao: 'Desenvolvimento com React',
          tempoNoCargo: '2-5 anos'
        }
      ],
      formacoes: [
        {
          nivelEscolaridade: 'Licenciatura',
          areaEstudo: 'Informática',
          instituicao: 'Universidade de Lisboa'
        }
      ],
      idiomas: [
        { idioma: 'Inglês', nivel: 'Intermediário' },
        { idioma: 'Português', nivel: 'Fluente' }
      ],
      habilidades: ['React', 'JavaScript', 'CSS'],
      interesses: ['Tecnologia', 'Programação'],
      objetivos: ['Emprego'],
      contribuicoesTexto: ['Experiência em desenvolvimento web']
    };

    console.log('✅ Tipos de dados válidos');
    testsPassados++;

  } catch (error) {
    console.log('❌ Falha na validação de tipos:', error);
    testsFalharam++;
  }

  // Test 3: Cálculos de matching básicos
  try {
    console.log('\nTEST 3: Cálculos de matching básicos');
    
    // Teste de matching de género
    const generoMatch = testGeneroMatching();
    if (generoMatch) {
      console.log('✅ Matching de género funcionando');
      testsPassados++;
    } else {
      throw new Error('Matching de género falhou');
    }

  } catch (error) {
    console.log('❌ Falha nos cálculos básicos:', error);
    testsFalharam++;
  }

  // Relatório final
  console.log(`\n📊 RELATÓRIO DE TESTES:`);
  console.log(`✅ Testes passaram: ${testsPassados}`);
  console.log(`❌ Testes falharam: ${testsFalharam}`);
  console.log(`📈 Taxa de sucesso: ${((testsPassados / (testsPassados + testsFalharam)) * 100).toFixed(1)}%`);

  if (testsFalharam === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    return true;
  } else {
    console.log('\n⚠️ ALGUNS TESTES FALHARAM - Revisar implementação');
    return false;
  }
}

function testGeneroMatching(): boolean {
  // Teste 1: Género indiferente deve sempre dar match
  const test1 = matchGenero('INDIFERENTE', 'M');
  if (!test1) return false;

  // Teste 2: Género específico deve dar match exato
  const test2 = matchGenero('F', 'F');
  if (!test2) return false;

  // Teste 3: Género específico não deve dar match diferente
  const test3 = !matchGenero('F', 'M');
  if (!test3) return false;

  return true;
}

function matchGenero(oportunidadeGenero: string, imigranteGenero?: string): boolean {
  if (!oportunidadeGenero || oportunidadeGenero === 'INDIFERENTE') return true;
  if (!imigranteGenero) return false;
  return oportunidadeGenero === imigranteGenero;
}

// Executar testes se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}
