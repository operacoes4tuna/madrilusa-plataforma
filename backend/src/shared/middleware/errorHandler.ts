import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../../shared-types/api.types';

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    const apiError: ApiError = {
      message: error.message,
      code: error.code,
      details: error.details
    };

    return res.status(error.statusCode).json({
      success: false,
      error: apiError.message,
      code: apiError.code,
      details: apiError.details
    });
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Este email já está em uso',
        code: 'DUPLICATE_EMAIL'
      });
    }
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR'
  });
}; 