import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
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
      const rpcContext = context.switchToRpc().getData();
      const token = rpcContext.token as string;
      if (!token) {
        throw new UnauthorizedException('Missing authentication token');
      }
      try {
        this.jwtService.verify(token, { secret: 'your_jwt_secret_key' });
        delete rpcContext.token;
        return true;
      } catch (e) {
        throw new UnauthorizedException(e.message);
      }
    }

    return super.canActivate(context);
  }
}
