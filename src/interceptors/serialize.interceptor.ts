import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run Something before a request is Handled by the request handler
    //console.log('Running before the handler', context);

    return handler.handle().pipe(
      map((data: T) => {
        // Run Something before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Hide everything expect for @Expose properties
        });
      }),
    );
  }
}
