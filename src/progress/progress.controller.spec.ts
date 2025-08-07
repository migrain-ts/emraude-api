import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

describe('ProgressController', () => {
  let controller: ProgressController;
  let progressService: Partial<Record<keyof ProgressService, jest.Mock>>;

  beforeEach(async () => {
    progressService = {
      getProgress: jest.fn(),
      updateProgress: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
          useValue: progressService,
        },
      ],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
  });

  describe('getProgress', () => {
    it('should call getProgress with userId from req.user and return result', async () => {
      const mockUserId = new Types.ObjectId();
      const mockReq = { user: { userId: mockUserId.toHexString() } } as any;
      const mockResult = { currentLevel: 2, scoreTotal: 500 };

      progressService.getProgress?.mockResolvedValue(mockResult);

      const result = await controller.getProgress(mockReq);

      expect(progressService.getProgress).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateProgress', () => {
    it('should call updateProgress with userId and DTO and return result', async () => {
      const mockUserId = new Types.ObjectId();
      const mockReq = { user: { userId: mockUserId.toHexString() } } as any;
      const updateDto = { currentLevel: 3, totalScore: 700 };
      const mockResult = { currentLevel: 3, scoreTotal: 700 };

      progressService.updateProgress?.mockResolvedValue(mockResult);

      const result = await controller.updateProgress(mockReq, updateDto);

      expect(progressService.updateProgress).toHaveBeenCalledWith(
        mockUserId,
        updateDto,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
