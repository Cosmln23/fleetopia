import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function errorResponse(
  error: string | ApiError,
  status: number = 500
): NextResponse<ApiResponse> {
  const errorObj = typeof error === 'string' ? { message: error } : error;
  
  return NextResponse.json(
    {
      success: false,
      error: errorObj.message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function validationErrorResponse(
  error: ZodError
): NextResponse<ApiResponse> {
  const firstError = error.issues[0];
  const message = `${firstError.path.join('.')}: ${firstError.message}`;
  
  return NextResponse.json(
    {
      success: false,
      error: `Validation error: ${message}`,
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(
  message: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

export function forbiddenResponse(
  message: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}

export function notFoundResponse(
  message: string = 'Not found'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

export function rateLimitResponse(
  message: string = 'Too many requests'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 429 }
  );
}

export async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

export function getQueryParam(
  url: URL,
  param: string,
  defaultValue?: string
): string | undefined {
  return url.searchParams.get(param) || defaultValue;
}

export function getNumericQueryParam(
  url: URL,
  param: string,
  defaultValue?: number
): number | undefined {
  const value = url.searchParams.get(param);
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}