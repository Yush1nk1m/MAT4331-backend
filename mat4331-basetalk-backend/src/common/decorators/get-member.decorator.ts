import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Member } from '../../modules/member/member.entity';

export const GetMember = createParamDecorator(
  (data, ctx: ExecutionContextHost): Member => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
