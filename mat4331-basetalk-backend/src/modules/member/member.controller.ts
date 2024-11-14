import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MemberService } from './member.service';
import { GetMember } from '../../common/decorators/get-member.decorator';
import { Member } from './member.entity';

@ApiTags('Member')
@ApiBadRequestResponse({
  description: '요청 형식이 유효하지 않다.',
})
@ApiUnauthorizedResponse({
  description: '회원 인증 정보가 유효하지 않다.',
})
@ApiInternalServerErrorResponse({
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('v1/members')
export class MemberController {
  private readonly logger: Logger = new Logger(MemberController.name);

  constructor(private readonly memberService: MemberService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[M-01] 회원 탈퇴',
    description:
      '서비스 회원 탈퇴를 수행한다. JWT 전략으로 인해 멱등성을 만족하지 않는다.',
  })
  @ApiNoContentResponse({
    description: '회원 탈퇴에 성공한다.',
  })
  @ApiNotFoundResponse({
    description: '같은 ID를 가진 회원을 찾을 수 없다.',
  })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async deleteMember(@GetMember() member: Member): Promise<void> {
    await this.memberService.deleteMember(member);
  }
}
