import { of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TransformResponseInterceptor } from './transform-response.interceptor';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformResponseInterceptor();
  });

  it('should wrap raw object payload into { code: 0, message: "OK", data } envelope', (done) => {
    const rawData = { foo: 'bar', count: 42 };
    const mockCallHandler: CallHandler = {
      handle: () => of(rawData),
    };
    const mockContext = {} as ExecutionContext;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (val) => {
        expect(val).toEqual({
          code: 0,
          message: 'OK',
          data: rawData,
        });
        done();
      },
      error: done,
    });
  });

  it('should preserve empty arrays without converting to null', (done) => {
    const emptyArray: unknown[] = [];
    const mockCallHandler: CallHandler = {
      handle: () => of(emptyArray),
    };
    const mockContext = {} as ExecutionContext;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (val) => {
        expect(val).toEqual({
          code: 0,
          message: 'OK',
          data: [],
        });
        done();
      },
      error: done,
    });
  });

  it('should not double wrap if payload is already in envelope format', (done) => {
    const alreadyWrapped = {
      code: 0,
      message: 'OK',
      data: { status: 'healthy' },
    };
    const mockCallHandler: CallHandler = {
      handle: () => of(alreadyWrapped),
    };
    const mockContext = {} as ExecutionContext;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (val) => {
        expect(val).toEqual(alreadyWrapped);
        done();
      },
      error: done,
    });
  });
});
