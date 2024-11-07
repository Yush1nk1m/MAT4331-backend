import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { Repository } from 'typeorm';
import { Member } from '../member/member.entity';
import { Game } from '../game/game.entity';
import { KBOTeam } from '../common/types/KBO-team.enum';

@Injectable()
export class ChatroomRepository {
  constructor(
    @InjectRepository(Chatroom)
    private readonly repository: Repository<Chatroom>,
  ) {}

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
      participantCount: 1,
    });

    // save and return it
    return this.repository.save(chatroom);
  }
}
