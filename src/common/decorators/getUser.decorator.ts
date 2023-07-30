import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getPayloadDecoratorDto } from 'src/users/dto/response/get-user-decorator.dto';

export const GetPayload = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return new getPayloadDecoratorDto(req.user.payload);
  },
);
