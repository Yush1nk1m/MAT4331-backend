import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { Repository } from 'typeorm';
import { Member } from '../member/member.entity';
import { Game } from '../game/game.entity';
import { KBOTeam } from '../../common/types/KBO-team.enum';

@Injectable()
export class ChatroomRepository {
  constructor(
    @InjectRepository(Chatroom)
    private readonly repository: Repository<Chatroom>,
  ) {}

  /**
   * method for creating new chatroom
   * @param creator member who creates chatroom
   * @param game KBO game that chatroom belonged to
   * @param title chatroom's title
   * @param preferTeam chatroom's prefer team
   * @returns created chatroom
   */
  async createChatroom(
    creator: Member,
    game: Game,
    title: string,
    preferTeam: KBOTeam,
  ): Promise<Chatroom> {
    // create Chatroom instance
    const chatroom: Chatroom = this.repository.create({
      creator: Promise.resolve(creator),
      game: Promise.resolve(game),
      title,
      preferTeam,
      participantCount: 0,
    });

    // save and return it
    return this.repository.save(chatroom);
  }

  /**
   * method for finding chatroom by its id
   * @param id chatroom's id
   * @returns found chatroom
   */
  async findChatroomById(id: number): Promise<Chatroom> {
    return this.repository.findOneBy({ id });
  }
}
