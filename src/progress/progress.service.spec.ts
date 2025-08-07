import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let progressModel: any;

  beforeEach(async () => {
    progressModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getModelToken('Progress'),
          useValue: progressModel,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  describe('getProgress', () => {
    it('should return progress if found', async () => {
      const userId = new Types.ObjectId();
      const mockProgress = { user: userId, currentLevel: 2, scoreTotal: 500 };
      progressModel.findOne.mockResolvedValue(mockProgress);

      const result = await service.getProgress(userId);

      expect(progressModel.findOne).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(mockProgress);
    });

    it('should return null if progress not found', async () => {
      const userId = new Types.ObjectId();
      progressModel.findOne.mockResolvedValue(null);

      const result = await service.getProgress(userId);

      expect(progressModel.findOne).toHaveBeenCalledWith({ user: userId });
      expect(result).toBeNull();
    });
  });

  describe('updateProgress', () => {
    it('should update progress and return updated progress', async () => {
      const userId = new Types.ObjectId();
      const updateDto = { currentLevel: 3, totalScore: 700 };
      const updatedProgress = {
        user: userId,
        currentLevel: 3,
        scoreTotal: 700,
      };

      progressModel.findOneAndUpdate.mockResolvedValue(updatedProgress);
      progressModel.findOne.mockResolvedValue(updatedProgress);

      const result = await service.updateProgress(userId, updateDto);

      expect(progressModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user: userId },
        {
          $set: {
            currentLevel: updateDto.currentLevel,
            scoreTotal: updateDto.totalScore,
            lastGamePlayed: expect.any(Date),
          },
        },
        { new: true, upsert: true },
      );

      expect(progressModel.findOne).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(updatedProgress);
    });
  });
});
