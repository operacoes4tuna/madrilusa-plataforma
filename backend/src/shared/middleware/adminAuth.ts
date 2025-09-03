// Middleware de Autenticação Admin para Operações Sensíveis

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar se o usuário é admin
 * Por enquanto, permite todos os usuários autenticados para desenvolvimento
 * TODO: Implementar verificação de papel/categoria admin quando sistema estiver pronto
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    // TODO: Verificar se usuário é admin
    // Por enquanto, permite todos os usuários autenticados
    // Futuramente: verificar req.user.categoria === 'ADMIN' ou similar
    
    // Log para auditoria
    console.log(`🛡️  ADMIN: Operação administrativa autorizada para usuário ${req.user.id}`);
    
    next();

  } catch (error) {
    console.error('❌ ADMIN: Erro no middleware de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para operações de configuração críticas
 * Adiciona logging extra e validações
 */
export const requireConfigAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Primeiro, verificar se é admin
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária para configurações'
      });
    }

    // Log detalhado para operações críticas
    const operation = req.method;
    const endpoint = req.originalUrl;
    const userId = req.user.id;
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`🔧 CONFIG ADMIN: ${operation} ${endpoint}`);
    console.log(`   👤 Usuário: ${userId}`);
    console.log(`   🌐 IP: ${ip}`);
    console.log(`   🖥️  User-Agent: ${userAgent}`);

    // Validações adicionais para operações destrutivas
    if (['POST', 'PUT', 'DELETE'].includes(operation)) {
      // Verificar se há dados no body para operações que modificam
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Dados necessários para esta operação'
        });
      }

      console.log(`⚠️  CONFIG ADMIN: Operação modificadora detectada`);
    }

    next();

  } catch (error) {
    console.error('❌ CONFIG ADMIN: Erro no middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para logging de operações de configuração
 */
export const logConfigOperation = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.json;

  // Override do res.json para capturar resposta
  res.json = function(body: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log da operação
    console.log(`📊 CONFIG LOG: ${req.method} ${req.originalUrl}`);
    console.log(`   ⏱️  Duração: ${duration}ms`);
    console.log(`   ✅ Status: ${res.statusCode}`);
    console.log(`   👤 Usuário: ${req.user?.id || 'N/A'}`);
    
    if (body && !body.success) {
      console.log(`   ❌ Erro: ${body.message || 'N/A'}`);
    }

    // Chamar o método original
    return originalSend.call(this, body);
  };

  next();
};
