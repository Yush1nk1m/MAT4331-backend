import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { ChatroomService } from './chatroom.service';
import { ChatroomDto } from './dto/chatroom.dto';
import { Chatroom } from './chatroom.entity';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Member } from '../member/member.entity';
import { ChatroomIdDto } from './dto/chatroom-id.dto';
import { GetMember } from '../../common/decorators/get-member.decorator';
import { EditTitleDto } from './dto/edit-title.dto';
import { GameIdDto } from './dto/game-id.dto';

@ApiTags('Chatroom')
@ApiBadRequestResponse({
  description: '요청 형식이 유효하지 않다.',
})
@ApiInternalServerErrorResponse({
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('v1/chatrooms')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[CR-01] 채팅방 생성',
    description:
      '경기 ID, 채팅방 제목, 선호 팀 정보를 받아 새로운 채팅방을 생성한다.',
  })
  @ApiCreatedResponse({
    description: '채팅방이 생성에 성공하여 채팅방의 정보를 응답한다.',
    type: ChatroomDto,
  })
  @ApiNotFoundResponse({
    description: '회원 또는 KBO 경기 정보가 존재하지 않는다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  async createChatroom(
    @GetMember() member: Member,
    @Body() createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDto> {
    // create the new chatroom and get its information
    const createdChatroom: Chatroom = await this.chatroomService.createChatroom(
      member,
      createChatroomDto,
    );

    // plain to DTO instance and return
    const chatroomDto: ChatroomDto = plainToInstance(
      ChatroomDto,
      createdChatroom,
      { excludeExtraneousValues: true },
    );

    return chatroomDto;
  }

  /**
   * method for joining the member to the specified chatroom, it satisfies idempotency
   * @param member Member instance
   * @param joinChatroomParamsDto chatroom's id
   */
  @ApiBearerAuth()
  @ApiParam({
    name: 'chatroomId',
    description: "chatroom's id",
    example: '1',
  })
  @ApiOperation({
    summary: '[CR-02] 채팅방 입장',
    description: '생성되어 있는 채팅방에 입장한다. 이 API는 멱등성을 만족한다.',
  })
  @ApiNoContentResponse({
    description:
      '채팅방 입장에 성공한다. 멱등성을 만족하므로 이미 입장해 있어도 성공을 응답한다.',
  })
  @ApiNotFoundResponse({
    description: '회원 또는 채팅방 정보를 찾을 수 없다.',
  })
  @ApiConflictResponse({
    description: '채팅방이 정원에 도달하여 입장에 실패한다.',
  })
  @Post(':chatroomId/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async joinChatroom(
    @GetMember() member: Member,
    @Param() chatroomIdDto: ChatroomIdDto,
  ): Promise<void> {
    // destruct DTO
    const { chatroomId } = chatroomIdDto;

    // join the member to the chatroom
    await this.chatroomService.joinChatroom(member, chatroomId);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'chatroomId',
    description: "chatroom's id",
    example: '1',
  })
  @ApiOperation({
    summary: '[CR-03] 채팅방 퇴장',
    description: '참여해 있는 채팅방에서 퇴장한다. 이 API는 멱등성을 만족한다.',
  })
  @ApiNoContentResponse({
    description:
      '채팅방 퇴장에 성공한다. 멱등성을 만족하므로 이미 퇴장해 있어도 성공을 응답한다.',
  })
  @ApiNotFoundResponse({
    description: '회원 또는 채팅방을 찾을 수 없다.',
  })
  @Post(':chatroomId/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async leaveChatroom(
    @GetMember() member: Member,
    @Param() chatroomIdDto: ChatroomIdDto,
  ): Promise<void> {
    // desctruct DTO
    const { chatroomId } = chatroomIdDto;

    // leave the member from the chatroom
    await this.chatroomService.leaveChatroom(member, chatroomId);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'chatroomId',
    description: "chatroom's id",
    example: '1',
  })
  @ApiOperation({
    summary: '[CR-04] 채팅방 제목 변경',
    description: '채팅방의 제목을 변경한다.',
  })
  @ApiOkResponse({
    description: '채팅방 제목 변경에 성공한다.',
    type: ChatroomDto,
  })
  @ApiForbiddenResponse({
    description: '채팅방의 생성자가 아니므로 제목을 변경할 수 없다.',
  })
  @ApiNotFoundResponse({
    description: '채팅방이 존재하지 않는다.',
  })
  @Patch(':chatroomId/title')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async editChatroomTitle(
    @GetMember() member: Member,
    @Param() chatroomIdDto: ChatroomIdDto,
    @Body() editTitleDto: EditTitleDto,
  ): Promise<ChatroomDto> {
    // destruct DTO
    const { chatroomId } = chatroomIdDto;
    const { title } = editTitleDto;

    // change the title of the chatroom
    const chatroom: Chatroom = await this.chatroomService.editChatroomTitle(
      member,
      chatroomId,
      title,
    );

    // return the chatroomDto
    const chatroomDto: ChatroomDto = plainToInstance(ChatroomDto, chatroom, {
      excludeExtraneousValues: true,
    });

    return chatroomDto;
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'chatroomId',
    description: "chatroom's id",
    example: '1',
  })
  @ApiOperation({
    summary: '[CR-05] 채팅방 삭제',
    description: '채팅방을 삭제한다. 멱등성을 만족한다.',
  })
  @ApiNoContentResponse({
    description: '채팅방 삭제에 성공한다. 어떤 데이터도 응답하지 않는다.',
  })
  @ApiForbiddenResponse({
    description: '채팅방의 생성자가 아니므로 삭제할 수 없다.',
  })
  @Delete(':chatroomId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async deleteChatroom(
    @GetMember() member: Member,
    @Param() chatroomIdDto: ChatroomIdDto,
  ): Promise<void> {
    // destruct DTO
    const { chatroomId } = chatroomIdDto;

    // delete the chatroom
    await this.chatroomService.deleteChatroom(member, chatroomId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[CR-06] 내 채팅방 조회',
    description: '회원이 참여한 채팅방을 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅방 조회에 성공한다.',
    type: [ChatroomDto],
  })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getMyChatrooms(@GetMember() member: Member): Promise<ChatroomDto[]> {
    // find chatrooms the member beloged to
    const chatrooms: Chatroom[] =
      await this.chatroomService.findChatroomsByMember(member);

    // plain to ChatroomDto instances
    const chatroomDtos: ChatroomDto[] = chatrooms.map((chatroom) => {
      return plainToInstance(ChatroomDto, chatroom, {
        excludeExtraneousValues: true,
      });
    });

    return chatroomDtos;
  }

  @ApiParam({
    name: 'gameId',
    description: "game's id",
    example: '1',
  })
  @ApiOperation({
    summary: '[CR-07] 특정 경기의 채팅방 조회',
    description: '특정 KBO 경기의 채팅방을 조회한다.',
  })
  @ApiOkResponse({
    description: '채팅방 조회에 성공한다.',
    type: [ChatroomDto],
  })
  @Get(':gameId')
  @HttpCode(HttpStatus.OK)
  async getChatroomsOfGame(
    @Param() gameIdDto: GameIdDto,
  ): Promise<ChatroomDto[]> {
    // desctruct DTO
    const { gameId } = gameIdDto;

    // find chatroom by the specified game id
    const chatrooms: Chatroom[] =
      await this.chatroomService.findChatroomsByGameId(gameId);

    // plain to ChatroomDto instances
    const chatroomDtos: ChatroomDto[] = chatrooms.map((chatroom) => {
      return plainToInstance(ChatroomDto, chatroom, {
        excludeExtraneousValues: true,
      });
    });

    return chatroomDtos;
  }
}
