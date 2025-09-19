# 🚀 Scripts de Deploy Madrilusa

Este diretório contém todos os scripts necessários para o deploy e manutenção da plataforma Madrilusa no Digital Ocean.

## 📋 Scripts Disponíveis

### 🔧 Setup Inicial
```bash
./scripts/setup-server.sh
```
**Função**: Prepara o servidor Ubuntu no Digital Ocean com todas as dependências necessárias.

**O que faz**:
- Instala Node.js 18 LTS
- Instala Docker e Docker Compose
- Instala nginx e certbot
- Configura firewall
- Cria usuário `madrilusa`
- Configura backups automáticos
- Prepara estrutura de diretórios

### 🚀 Deploy da Aplicação
```bash
./scripts/deploy.sh
```
**Função**: Faz o deploy completo da aplicação no servidor.

**O que faz**:
- Faz backup do banco atual
- Sincroniza código via rsync
- Builda as imagens Docker
- Inicia os containers
- Verifica health checks

### 🔒 Configuração SSL
```bash
./scripts/ssl-setup.sh
```
**Função**: Configura certificados SSL com Let's Encrypt.

**Pré-requisitos**:
- DNS configurado apontando para o servidor
- Editar script com seus domínios reais

### 📊 Monitoramento
```bash
./scripts/monitor.sh
```
**Função**: Monitora o status da aplicação e recursos do servidor.

**Informações exibidas**:
- Status dos containers
- Uso de CPU, memória e disco
- Conectividade dos serviços
- Logs recentes
- Status dos backups

### 🔄 Restart da Aplicação
```bash
./scripts/restart.sh
```
**Função**: Reinicia os containers da aplicação.

**Útil para**:
- Aplicar mudanças de configuração
- Resolver problemas de memória
- Restart após atualizações

### 💾 Backup Manual
```bash
./scripts/backup.sh
```
**Função**: Cria backup manual do banco e configurações.

**Cria**:
- Backup do banco SQLite
- Backup das configurações
- Download local dos backups

## 🗂️ Ordem de Execução (Primeiro Deploy)

### 1. Setup Inicial do Servidor
```bash
./scripts/setup-server.sh
```

### 2. Deploy da Aplicação
```bash
./scripts/deploy.sh
```

### 3. Configurar SSL (Opcional)
```bash
# Editar o script com seus domínios
nano scripts/ssl-setup.sh
./scripts/ssl-setup.sh
```

### 4. Verificar Status
```bash
./scripts/monitor.sh
```

## 🔧 Configurações Necessárias

### Antes do Primeiro Deploy

1. **Chave SSH**: Verificar se existe `env/digital-ocean-tuninho-a4tunados`
2. **Variáveis de Ambiente**: Configurar `backend/.env.production`
3. **Domínios**: Editar scripts com seus domínios reais

### Arquivos de Configuração

- `docker-compose.yml` - Orquestração dos containers
- `nginx.conf` - Configuração do proxy reverso
- `Dockerfile.frontend` - Imagem do React
- `Dockerfile.backend` - Imagem do Node.js
- `backend/.env.production` - Variáveis de ambiente

## 📊 Estrutura no Servidor

```
/home/madrilusa/madrilusa/
├── data/              # Banco SQLite
├── logs/              # Logs da aplicação
├── backups/           # Backups automáticos
├── ssl/               # Certificados SSL
├── docker-compose.yml # Configuração containers
├── nginx.conf         # Configuração nginx
└── monitor.sh         # Script de monitoramento local
```

## 🌐 URLs de Acesso

Após o deploy bem-sucedido:

- **Frontend**: `http://167.99.203.215:8080`
- **Backend**: `http://167.99.203.215:3001`
- **Health Check**: `http://167.99.203.215:3001/health`

Com SSL configurado:
- **HTTPS**: `https://seudominio.com`

## 🛠️ Comandos Úteis

### Conectar ao Servidor
```bash
ssh -i env/digital-ocean-tuninho-a4tunados madrilusa@167.99.203.215
```

### Logs em Tempo Real
```bash
ssh -i env/digital-ocean-tuninho-a4tunados madrilusa@167.99.203.215 "cd madrilusa && docker-compose logs -f"
```

### Status dos Containers
```bash
ssh -i env/digital-ocean-tuninho-a4tunados madrilusa@167.99.203.215 "cd madrilusa && docker-compose ps"
```

### Executar Monitoramento Local
```bash
ssh -i env/digital-ocean-tuninho-a4tunados madrilusa@167.99.203.215 "cd madrilusa && ./monitor.sh"
```

## 🔍 Troubleshooting

### Container não inicia
```bash
./scripts/monitor.sh
# Verificar logs específicos
ssh -i env/digital-ocean-tuninho-a4tunados madrilusa@167.99.203.215 "cd madrilusa && docker-compose logs backend"
```

### Banco de dados corrompido
```bash
./scripts/backup.sh  # Verificar backups disponíveis
# Restaurar backup mais recente
```

### SSL não funciona
```bash
# Verificar se domínio aponta para o servidor
nslookup seudominio.com
# Reconfigurar SSL
./scripts/ssl-setup.sh
```

### Aplicação lenta
```bash
./scripts/monitor.sh  # Verificar uso de recursos
./scripts/restart.sh  # Restart para limpar memória
```

## 📞 Suporte

Para questões técnicas:
- **ADRITEM**: madrilusa@adritem.pt | (+351) 937 342 173
- **Documentação**: `doc/03_IMPLEMENTACAO_TECNICA/19_Deploy_Digital_Ocean_Completo.md`

---

**Scripts criados com ❤️ para a plataforma Madrilusa**

*Projeto de Inovação e Empreendedorismo Social*
*Federação Minha Terra • ADRITEM • ADRACES • CoraNE*