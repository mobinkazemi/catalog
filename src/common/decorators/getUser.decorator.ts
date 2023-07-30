import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUserDecoratorDto } from 'src/users/dto/response/get-user-decorator.dto';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return new getUserDecoratorDto(req.user.payload);
});
