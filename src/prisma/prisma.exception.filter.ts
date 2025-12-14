import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code === 'P2002') {
      response.status(409).json({
        statusCode: 409,
        message: 'Unique constraint failed',
        details: exception.meta,
      });
    }
    console.info(exception.code);
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
