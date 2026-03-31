import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run Something before a request is Handled by the request handler
    //console.log('Running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run Something before the response is sent out
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true, // Hide everything expect for @Expose properties
        });
      }),
    );
  }
}
