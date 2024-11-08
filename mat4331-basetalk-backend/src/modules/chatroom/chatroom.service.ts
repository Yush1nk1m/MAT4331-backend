import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChatroomRepository } from './chatroom.repository';
import { Member } from '../member/member.entity';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { Chatroom } from './chatroom.entity';
import { Transactional } from 'typeorm-transactional';
import { Game } from '../game/game.entity';
import { GameService } from '../game/game.service';
import { MemberChatroomService } from '../member-chatroom/member-chatroom.service';
import { MemberChatroom } from '../member-chatroom/member-chatroom.entity';
import { MemberService } from '../member/member.service';

@Injectable()
export class ChatroomService {
  private logger = new Logger(ChatroomService.name);

  constructor(
    private readonly chatroomRepository: ChatroomRepository,
    private readonly memberService: MemberService,
    private readonly gameService: GameService,
    private readonly memberChatroomService: MemberChatroomService,
  ) {}

  /**
   * method for creating new chatroom
   * @param member member
   * @param createChatroomDto gameId, title, preferTeam
   * @returns created chatroom
   */
  @Transactional()
  async createChatroom(
    memberId: number,
    createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    // destruct DTO
    const { gameId, title, preferTeam } = createChatroomDto;

    // validate member if it exist
    const member: Member = await this.memberService.findMemberById(memberId);
    // if it does not exist, throw NotFound exception
    if (!member) {
      throw new NotFoundException(`Member with id: ${memberId} not exists`);
    }

    // validate game if it exist
    const game: Game = await this.gameService.findGameById(gameId);
    // if it does not exist, throw NotFound exception
    if (!game) {
      throw new NotFoundException(`Game with id: ${gameId} not exists`);
    }

    this.logger.debug(`game with id: ${game.id} has been found.`);

    // create the new chatroom
    const chatroom: Chatroom = await this.chatroomRepository.createChatroom(
      member,
      game,
      title,
      preferTeam,
    );

    this.logger.debug(
      `chatroom with (id: ${chatroom.id}, title: ${chatroom.title}, participation: ${chatroom.participantCount}) has been created.`,
    );

    // if the chatroom has created, the creator needs to be participated in
    const memberChatroom: MemberChatroom =
      await this.memberChatroomService.joinMemberToChatroom(member, chatroom);

    this.logger.debug(
      `memberChatroom with id: ${memberChatroom.id} has been created.`,
    );

    // return the chatroom information
    return chatroom;
  }

  /**
   * method for finding chatroom by its id
   * @param chatroomId chatroom's id
   * @returns found chatroom
   */
  async findChatroomById(chatroomId: number): Promise<Chatroom> {
    return this.chatroomRepository.findChatroomById(chatroomId);
  }
}
