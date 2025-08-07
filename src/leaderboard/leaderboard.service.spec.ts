import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let progressModel: any;

  beforeEach(async () => {
    const findMock = jest.fn().mockReturnThis();
    const sortMock = jest.fn().mockReturnThis();
    const populateMock = jest.fn().mockReturnThis();
    const limitMock = jest.fn().mockResolvedValue([
      {
        _id: 'progress1',
        user: { nickname: 'Player1' },
        scoreTotal: 1000,
      },
      {
        _id: 'progress2',
        user: { nickname: 'Player2' },
        scoreTotal: 900,
      },
    ]);

    progressModel = {
      find: findMock,
      sort: sortMock,
      populate: populateMock,
      limit: limitMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: getModelToken('Progress'),
          useValue: progressModel,
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should return top 10 players with nickname and score', async () => {
    const result = await service.getTop10Players();

    expect(progressModel.find).toHaveBeenCalled();
    expect(progressModel.sort).toHaveBeenCalledWith({ scoreTotal: -1 });
    expect(progressModel.populate).toHaveBeenCalledWith('user', 'nickname');
    expect(progressModel.limit).toHaveBeenCalledWith(10);
    expect(result).toHaveLength(2);
    expect((result[0].user as any).nickname).toBe('Player1');
  });
});
