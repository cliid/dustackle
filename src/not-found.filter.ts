import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundFilter<T extends NotFoundException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.log('Route not found');
    host
      .switchToHttp()
      .getResponse()
      .status(exception.getStatus())
      .send({
        statusCode: exception.getStatus(),
        ...(exception.getResponse() as object)
      });
  }
}
