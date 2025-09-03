// Middleware de Autenticação JWT

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        categoria?: string;
        nomeCompleto?: string;
      };
      userId?: string; // Para compatibilidade com código existente
    }
  }
}

/**
 * Middleware para verificar token JWT
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // DESENVOLVIMENTO: Aceitar token de desenvolvimento
    if (token === 'development-token') {
      console.log('🔓 AUTH: Usando token de desenvolvimento');
      req.user = {
        id: 'dev-user-123',
        email: 'admin@madrilusa.com',
        categoria: 'admin',
        nomeCompleto: 'Administrador Dev'
      };
      req.userId = 'dev-user-123';
      return next();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso necessário'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'madrilusa-secret-key-2024';
    
    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
      if (err) {
        console.log('🔒 AUTH: Token inválido:', err.message);
        return res.status(403).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Adicionar informações do usuário ao request
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        categoria: decoded.categoria,
        nomeCompleto: decoded.nomeCompleto
      };
      
      // Para compatibilidade com código existente
      req.userId = decoded.userId;

      console.log(`🔒 AUTH: Usuário autenticado - ${decoded.userId}`);
      next();
    });

  } catch (error) {
    console.error('❌ AUTH: Erro no middleware de autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware opcional - não falha se não houver token
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Sem token, mas continua
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET || 'madrilusa-secret-key-2024';
    
    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
      if (!err && decoded) {
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          categoria: decoded.categoria,
          nomeCompleto: decoded.nomeCompleto
        };
        req.userId = decoded.userId;
      }
      
      next();
    });

  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
};
