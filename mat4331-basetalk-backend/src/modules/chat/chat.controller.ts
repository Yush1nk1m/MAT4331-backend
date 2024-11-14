import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatPaginationDto } from './dto/chat-pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { Chat } from './chat.entity';
import { plainToInstance } from 'class-transformer';
import { GetMember } from '../../common/decorators/get-member.decorator';
import { Member } from '../member/member.entity';
import { ChatDto } from './dto/chat.dto';
import { EventPattern } from '@nestjs/microservices';
import { Events } from '../../common/constants/event.constant';
import { ChatSavePredictionDto } from './dto/chat-save-prediction.dto';

@ApiTags('Chat')
@ApiBadRequestResponse({
  description: '요청 형식이 유효하지 않다.',
})
@ApiUnauthorizedResponse({
  description: '회원의 권한이 없다.',
})
@ApiInternalServerErrorResponse({
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('v1/chats')
export class ChatController {
  private readonly logger: Logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  /**
   * handle Events.CHAT_SAVE_PREDICTION event
   * @param chatSavePredictionDto chat's id, prediction result
   */
  @EventPattern(Events.CHAT_SAVE_PREDICTION)
  async handleSavePrediction(
    chatSavePredictionDto: ChatSavePredictionDto,
  ): Promise<void> {
    this.logger.debug(
      `handle event ${Events.CHAT_SAVE_PREDICTION}: ${JSON.stringify(chatSavePredictionDto)}`,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[C-01] 채팅 목록 조회',
    description:
      '명시된 채팅의 ID를 기준으로 그 전에 작성된 채팅을 명시된 개수만큼 조회한다. 채팅 ID가 주어지지 않을 경우 가장 최근의 채팅을 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅의 페이지네이션 조회에 성공한다.',
    type: [ChatDto],
  })
  @ApiForbiddenResponse({
    description: '회원이 채팅방에 입장하지 않았으므로 채팅을 조회할 수 없다.',
  })
  @ApiNotFoundResponse({
    description: '채팅방 정보를 찾을 수 없다.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getChats(
    @GetMember() member: Member,
    @Query() chatPaginationDto: ChatPaginationDto,
  ): Promise<ChatDto[]> {
    const chats: Chat[] = await this.chatService.findChatsByPagination(
      member,
      chatPaginationDto,
    );

    const transformedChats: ChatDto[] = chats.map((chat) => {
      return plainToInstance(ChatDto, chat, {
        excludeExtraneousValues: true,
      });
    });

    return transformedChats;
  }
}
