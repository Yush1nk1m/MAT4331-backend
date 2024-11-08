import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomGateway } from './chatroom.gateway';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { ChatroomService } from './chatroom.service';
import { MemberChatroomService } from '../member-chatroom/member-chatroom.service';

describe('ChatroomGateway', () => {
  let gateway: ChatroomGateway;
  let redisService: RedisService;
  let jwtService: JwtService;
  let memberService: MemberService;
  let chatroomService: ChatroomService;
  let memberChatroomService: MemberChatroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatroomGateway,
        {
          provide: RedisService,
          useValue: {
            subscribeToChannel: jest.fn(),
            unsubscribeFromChannel: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: MemberService,
          useValue: { findMemberById: jest.fn() },
        },
        {
          provide: ChatroomService,
          useValue: {
            findChatroomById: jest.fn(),
          },
        },
        {
          provide: MemberChatroomService,
          useValue: {
            joinMemberToChatroom: jest.fn(),
            leaveMemberFromChatroom: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatroomGateway>(ChatroomGateway);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
    memberService = module.get<MemberService>(MemberService);
    chatroomService = module.get<ChatroomService>(ChatroomService);
    memberChatroomService = module.get<MemberChatroomService>(
      MemberChatroomService,
    );
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
