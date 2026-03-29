import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccessTokenPayload } from "src/auth/types/token-payload.type";

export const GetUser = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AccessTokenPayload;

    if (!data) {
      return user;
    }

    return user[data];
  },
);
