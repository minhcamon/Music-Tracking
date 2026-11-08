/**
 * Centralized API route paths and version constants.
 * Follows guidelines from docs/guidelines/backend/api-convention.md
 */
export class ApiPaths {
  public static readonly API_BASE = 'api';
  public static readonly API_VERSION_V1 = 'v1';
  public static readonly GLOBAL_PREFIX = `${ApiPaths.API_BASE}/${ApiPaths.API_VERSION_V1}`;

  // Resource Endpoints (relative to global prefix /api/v1)
  public static readonly HEALTH = 'health';
  public static readonly AUTH = 'auth';
  public static readonly PROVIDERS = 'providers';
  public static readonly LISTENING_EVENTS = 'listening-events';
  public static readonly SYNCHRONIZATION = 'sync';
}
