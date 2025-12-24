import * as Sentry from '@sentry/node';
import { Express } from 'express';
import { logger } from './logger';

/**
 * Sentry configuration for error tracking and performance monitoring
 */

const SENTRY_DSN = process.env.SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Initialize Sentry
 */
export function initSentry(app?: Express) {
  if (!SENTRY_DSN) {
    logger.warn('[Sentry] DSN not configured, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Performance monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0, // Sample 10% in production, 100% in dev

    // Release tracking
    release: process.env.GIT_COMMIT_SHA || 'development',

    // Enhanced error context
    integrations: [
      // Automatically capture console errors
      new Sentry.Integrations.Console({
        levels: ['error'],
      }),
      // Capture HTTP breadcrumbs
      new Sentry.Integrations.Http({ tracing: true }),
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      // Don't send health check errors
      if (event.request?.url?.includes('/health')) {
        return null;
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser errors
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Network errors
      'Network request failed',
      'NetworkError',
    ],
  });

  // Add Express integration if app is provided
  if (app) {
    // RequestHandler creates a separate execution context for each request
    app.use(Sentry.Handlers.requestHandler());

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }

  logger.info('[Sentry] Initialized successfully');
}

/**
 * Express error handler middleware (must be added after routes)
 */
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all errors with status code >= 500
      return true;
    },
  });
}

/**
 * Capture error manually with context
 */
export function captureError(
  error: Error,
  context?: {
    user?: { id: number; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  if (!SENTRY_DSN) {
    logger.error('[Sentry] Error not captured (DSN not configured):', error);
    return;
  }

  Sentry.withScope((scope) => {
    // Add user context
    if (context?.user) {
      scope.setUser({
        id: context.user.id.toString(),
        email: context.user.email,
      });
    }

    // Add tags
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Add extra context
    if (context?.extra) {
      scope.setExtras(context.extra);
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture message manually
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) {
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureMessage(message, level);
  });
}

/**
 * Start a new transaction for performance monitoring
 */
export function startTransaction(name: string, op: string) {
  if (!SENTRY_DSN) {
    return null;
  }

  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Close Sentry and flush events
 */
export async function closeSentry() {
  if (!SENTRY_DSN) {
    return;
  }

  await Sentry.close(2000); // Wait up to 2 seconds for events to be sent
  logger.info('[Sentry] Closed and flushed');
}

export default Sentry;
