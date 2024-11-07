import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetMemberId } from '../common/decorators/get-member.decorator';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { ChatroomService } from './chatroom.service';
import { CreatedChatroomDto } from './dto/created-chatroom.dto';
import { Chatroom } from './chatroom.entity';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
    type: CreatedChatroomDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  async createChatroom(
    @GetMemberId() memberId: number,
    @Body() createChatroomDto: CreateChatroomDto,
  ): Promise<CreatedChatroomDto> {
    // create the new chatroom and get its information
    const createdChatroom: Chatroom = await this.chatroomService.createChatroom(
      memberId,
      createChatroomDto,
    );

    // plain to DTO instance and return
    const createdChatroomDto: CreatedChatroomDto = plainToInstance(
      CreatedChatroomDto,
      createdChatroom,
      { excludeExtraneousValues: true },
    );

    return createdChatroomDto;
  }
}
