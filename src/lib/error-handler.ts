import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { errorResponse, validationErrorResponse } from './api-utils';
import { logger } from './logger';

export type ApiHandler = (
  request: NextRequest,
  context?: { params: any }
) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: { params: any }): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

function handleError(error: unknown, request: NextRequest): NextResponse {
  const url = request.nextUrl.pathname;
  const method = request.method;
  
  // Log the error
  logger.error('API Error', {
    url,
    method,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Error) {
    // Handle specific error messages
    if (error.message.includes('Unauthorized')) {
      return errorResponse('Unauthorized access', 401);
    }
    
    if (error.message.includes('Not found')) {
      return errorResponse('Resource not found', 404);
    }
    
    if (error.message.includes('Forbidden')) {
      return errorResponse('Access forbidden', 403);
    }
    
    if (error.message.includes('Invalid JSON')) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    // Generic error with message
    return errorResponse(error.message, 500);
  }

  // Fallback for unknown errors
  return errorResponse('Internal server error', 500);
}

function handlePrismaError(error: PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target;
      const field = Array.isArray(target) ? target[0] : 'field';
      return errorResponse(`${field} already exists`, 409);
    
    case 'P2025':
      // Record not found
      return errorResponse('Record not found', 404);
    
    case 'P2003':
      // Foreign key constraint violation
      return errorResponse('Related record not found', 400);
    
    case 'P2014':
      // Required relation missing
      return errorResponse('Required relation missing', 400);
    
    default:
      logger.error('Unhandled Prisma Error', {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
      return errorResponse('Database error', 500);
  }
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export function createAppError(
  message: string,
  statusCode: number = 500,
  code?: string
): AppError {
  return new AppError(message, statusCode, code);
}