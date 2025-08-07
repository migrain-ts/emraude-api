import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchStatus } from './entities/match.entity';
import { MatchService } from './match.service';

describe('MatchService', () => {
  let service: MatchService;
  let matchModel: any;

  beforeEach(async () => {
    const mockMatchModel = {
      save: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      populate: jest.fn(),
      lean: jest.fn(),
      constructor: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getModelToken('Match'),
          useValue: mockMatchModel,
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    matchModel = module.get(getModelToken('Match'));
  });

  describe('createMatch', () => {
    it('should create and save a new match', async () => {
      const player1id = 'player1id';
      const player2id = 'player2id';

      const saveMock = jest.fn().mockResolvedValue({
        player1Id: player1id,
        player2Id: player2id,
        state: MatchStatus.WAITING,
      });

      const mockMatchConstructor = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MatchService,
          {
            provide: getModelToken('Match'),
            useValue: mockMatchConstructor,
          },
        ],
      }).compile();

      const service = module.get<MatchService>(MatchService);

      const result = await service.createMatch(player1id, player2id);

      expect(mockMatchConstructor).toHaveBeenCalledWith({
        player1Id: player1id,
        player2Id: player2id,
        state: MatchStatus.WAITING,
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({
        player1Id: player1id,
        player2Id: player2id,
        state: MatchStatus.WAITING,
      });
    });
  });

  describe('getMatchById', () => {
    it('should find a match by id and populate user info', async () => {
      const matchId = 'matchId';

      const populateMock = jest.fn().mockReturnThis();
      const leanMock = jest.fn().mockResolvedValue({
        _id: matchId,
        player1Id: { nickname: 'p1', email: 'p1@example.com' },
        player2Id: { nickname: 'p2', email: 'p2@example.com' },
        winnerId: null,
        state: MatchStatus.WAITING,
      });

      matchModel.findById.mockReturnValue({
        populate: populateMock,
        lean: leanMock,
      });
      populateMock.mockReturnValue({
        populate: () => ({
          populate: () => ({
            lean: leanMock,
          }),
        }),
      });

      const result = await service.getMatchById(matchId);

      expect(matchModel.findById).toHaveBeenCalledWith(matchId);
      expect(result).toHaveProperty('player1Id.nickname', 'p1');
      expect(result).toHaveProperty('player2Id.email', 'p2@example.com');
    });
  });

  describe('setMatchResult', () => {
    it('should update the match with winnerId and state FINISHED', async () => {
      const matchId = 'matchid';
      const winnerId = 'winnerid';
      const updatedMatch = {
        _id: matchId,
        winnerId,
        state: MatchStatus.FINISHED,
      };

      matchModel.findByIdAndUpdate.mockResolvedValue(updatedMatch);

      const result = await service.setMatchResult(matchId, winnerId);

      expect(matchModel.findByIdAndUpdate).toHaveBeenCalledWith(
        matchId,
        { winnerId, state: MatchStatus.FINISHED },
        { new: true },
      );
      expect(result).toEqual(updatedMatch);
    });
  });
});
