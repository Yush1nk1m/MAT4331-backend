import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { Repository } from 'typeorm';
import { Member } from '../member/member.entity';
import { Game } from '../game/game.entity';
import { KBOTeam } from '../../common/types/KBO-team.enum';

@Injectable()
export class ChatroomRepository {
  private readonly logger: Logger = new Logger(ChatroomRepository.name);

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
      title,
      preferTeam,
      participantCount: 1,
    });

    chatroom.creator = Promise.resolve(creator);
    chatroom.game = Promise.resolve(game);

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

  /**
   * method for increasing participantCount by 1
   * @param id chatroom's id
   * @return updated participantCount
   */
  async incrementParticipantCount(id: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Chatroom)
      .set({ participantCount: () => 'participantCount + 1' })
      .where('id = :id', { id })
      .returning('participantCount')
      .execute();

    this.logger.debug(`increment result: ${JSON.stringify(result)}`);

    return result.raw[0].participant_count;
  }

  /**
   * method for decreasing participantCount by 1
   * @param id chatroom's id
   * @return updated participantCount
   */
  async decrementParticipantCount(id: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .update(Chatroom)
      .set({ participantCount: () => 'participantCount - 1' })
      .where('id = :id', { id })
      .returning('participantCount')
      .execute();

    this.logger.debug(`decrement result: ${JSON.stringify(result)}`);

    return result.raw[0].participant_count;
  }

  /**
   * method for deleting the chatroom
   * @param id chatroom's id
   */
  async deleteChatroomById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  /**
   * method for update and save chatroom's title
   * @param chatroom Chatroom entity
   * @param title new title
   * @returns updated Chatroom entity
   */
  async updateChatroomTitle(
    chatroom: Chatroom,
    title: string,
  ): Promise<Chatroom> {
    chatroom.title = title;
    return this.repository.save(chatroom);
  }

  /**
   * method for finding chatrooms by game's id it belonged
   * @param gameId game's id
   * @returns found chatrooms
   */
  async findChatroomsByGameId(gameId: number): Promise<Chatroom[]> {
    return this.repository.findBy({
      game: {
        id: gameId,
      },
    });
  }
}
