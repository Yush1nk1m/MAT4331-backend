import { Test, TestingModule } from '@nestjs/testing';
import { MemberChatroomService } from './member-chatroom.service';

describe('MemberChatroomService', () => {
  let service: MemberChatroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberChatroomService],
    }).compile();

    service = module.get<MemberChatroomService>(MemberChatroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
