import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponseEnvelope<T> {
  code: number | string;
  message: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseEnvelope<T>> {
    return next.handle().pipe(
      map((payload) => {
        // Prevent double wrapping if controller already returns an envelope
        if (
          payload !== null &&
          typeof payload === 'object' &&
          'code' in payload &&
          'message' in payload &&
          'data' in payload
        ) {
          return payload;
        }

        return {
          code: 0,
          message: 'OK',
          data: payload !== undefined ? payload : null,
        };
      }),
    );
  }
}
