import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;
  let leaderboardService: Partial<Record<keyof LeaderboardService, jest.Mock>>;

  beforeEach(async () => {
    leaderboardService = {
      getTop10Players: jest.fn().mockResolvedValue([
        { user: { nickname: 'Player1' }, scoreTotal: 1000 },
        { user: { nickname: 'Player2' }, scoreTotal: 900 },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: leaderboardService,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
  });

  it('should call getTop10Players and return data', async () => {
    const result = await controller.getTop10Players();

    expect(leaderboardService.getTop10Players).toHaveBeenCalled();
    expect(result).toEqual([
      { user: { nickname: 'Player1' }, scoreTotal: 1000 },
      { user: { nickname: 'Player2' }, scoreTotal: 900 },
    ]);
  });
});
