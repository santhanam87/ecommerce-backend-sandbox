import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const isRpc = context.getType() === 'rpc';

    if (isRpc) {
      // Extract data from the TCP context
      // const rpcContext = context.switchToRpc().getData();
      // const token = rpcContext.token; // Access the 'token' field we sent

      // if (!token) {
      //   throw new UnauthorizedException('Missing authentication token');
      // }

      try {
        // Validate the token (sync validation for simplicity)
        // const user = this.jwtService.verify(token);
        // Optionally attach the user payload to the data for use in the handler
        // rpcContext.user = user;
        return true;
      } catch (e) {
        console.info(e);
        throw new UnauthorizedException('Invalid token');
      }
    }

    return super.canActivate(context);
  }
}
