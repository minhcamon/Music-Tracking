/**
 * Standard business and HTTP error code constants.
 * Used for standard error envelope: { code: string, message: string, data: null }
 */
export enum ErrorCodes {
  SUCCESS = '0',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}
