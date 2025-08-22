import { Request, Response, NextFunction } from 'express';

// Interface para rate limiting
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Store simples em memória (em produção, usar Redis)
const rateLimitStore: RateLimitStore = {};

// Middleware de rate limiting para IA
export const aiRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 20; // máximo 20 requests por 15 min

  // Limpar entradas expiradas
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });

  // Verificar limite atual
  if (!rateLimitStore[clientId]) {
    rateLimitStore[clientId] = {
      count: 1,
      resetTime: now + windowMs
    };
  } else {
    rateLimitStore[clientId].count++;
  }

  // Verificar se excedeu limite
  if (rateLimitStore[clientId].count > maxRequests) {
    const timeLeft = Math.ceil((rateLimitStore[clientId].resetTime - now) / 1000 / 60);
    
    return res.status(429).json({
      success: false,
      error: 'Muitas solicitações de IA',
      message: `Limite de ${maxRequests} solicitações por 15 minutos excedido. Tente novamente em ${timeLeft} minutos.`,
      retryAfter: timeLeft
    });
  }

  // Adicionar headers informativos
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - rateLimitStore[clientId].count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimitStore[clientId].resetTime / 1000));

  next();
};

// Middleware de sanitização para IA
export const aiSanitization = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.text) {
    // Remover informações sensíveis
    req.body.text = req.body.text
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARTÃO]') // Cartões de crédito
      .replace(/\b\d{9}\b/g, '[DOCUMENTO]') // Documentos PT (9 dígitos)
      .replace(/\b[\w\.-]+@[\w\.-]+\.\w+\b/g, '[EMAIL]') // Emails
      .replace(/\b\d{9}\s?\d{3}\s?\d{3}\b/g, '[TELEFONE]') // Telefones PT
      .replace(/\b(?:senha|password|pass|pwd)\s*[:=]\s*\S+/gi, '[SENHA]'); // Senhas

    // Limitar tamanho do texto
    if (req.body.text.length > 2000) {
      req.body.text = req.body.text.slice(0, 2000);
    }
  }

  next();
};

// Middleware de logging para IA
export const aiLogging = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log da request
  console.log(`🤖 AI Request: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    textLength: req.body.text?.length || 0,
    timestamp: new Date().toISOString()
  });

  // Interceptar response para log
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    try {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log(`🤖 AI Response: ${req.method} ${req.path}`, {
        success: responseData.success,
        responseTime: `${responseTime}ms`,
        tokensUsed: responseData.data?.tokensUsed || 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log(`🤖 AI Response: ${req.method} ${req.path}`, {
        responseTime: `${responseTime}ms`,
        parseError: true
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

// Middleware combinado para rotas de IA
export const aiMiddleware = [
  aiLogging,
  aiRateLimit,
  aiSanitization
];
