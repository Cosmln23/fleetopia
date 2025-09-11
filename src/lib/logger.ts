type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userId?: string;
  traceId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`;
      const message = entry.message;
      const data = entry.data ? `\n${JSON.stringify(entry.data, null, 2)}` : '';
      return `${prefix}: ${message}${data}`;
    } else {
      // JSON format for production
      return JSON.stringify(entry);
    }
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      userId,
      traceId: this.generateTraceId(),
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }

    // In production, you might want to send logs to external service
    if (!this.isDevelopment && level === 'error') {
      this.sendToExternalService(entry);
    }
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // TODO: Implement external logging service (e.g., Sentry, LogRocket, etc.)
    // For now, just keep it in console
    try {
      // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, data?: any, userId?: string): void {
    this.log('debug', message, data, userId);
  }

  info(message: string, data?: any, userId?: string): void {
    this.log('info', message, data, userId);
  }

  warn(message: string, data?: any, userId?: string): void {
    this.log('warn', message, data, userId);
  }

  error(message: string, data?: any, userId?: string): void {
    this.log('error', message, data, userId);
  }

  // Specialized methods for common use cases
  apiRequest(method: string, url: string, userId?: string, data?: any): void {
    this.info(`API Request: ${method} ${url}`, { method, url, ...data }, userId);
  }

  apiResponse(method: string, url: string, status: number, duration: number, userId?: string): void {
    this.info(`API Response: ${method} ${url} - ${status}`, {
      method,
      url,
      status,
      duration: `${duration}ms`,
    }, userId);
  }

  apiError(method: string, url: string, error: any, userId?: string): void {
    this.error(`API Error: ${method} ${url}`, {
      method,
      url,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    }, userId);
  }

  userAction(action: string, userId: string, data?: any): void {
    this.info(`User Action: ${action}`, { action, ...data }, userId);
  }

  security(message: string, data?: any, userId?: string): void {
    this.warn(`SECURITY: ${message}`, data, userId);
  }

  performance(operation: string, duration: number, data?: any): void {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...data,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Utility function to measure execution time
export async function measureTime<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.performance(`${operation} (failed)`, duration);
    throw error;
  }
}

// Middleware helper for API logging
export function createApiLogger(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const start = Date.now();
    const method = request.method;
    const url = new URL(request.url).pathname;
    const userId = request.headers.get('x-user-id') || undefined;

    logger.apiRequest(method, url, userId);

    try {
      const response = await handler(request, ...args);
      const duration = Date.now() - start;
      const status = response instanceof Response ? response.status : 200;
      
      logger.apiResponse(method, url, status, duration, userId);
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      logger.apiError(method, url, error, userId);
      throw error;
    }
  };
}