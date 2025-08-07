import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
  ) {}

  async getProgress(userId: Types.ObjectId): Promise<Progress | null> {
    const currentProgress = await this.progressModel.findOne({ user: userId });
    if (!currentProgress) return null;
    return currentProgress;
  }

  async updateProgress(
    userId: Types.ObjectId,
    updateProgressDto: UpdateProgressDto,
  ) {
    await this.progressModel.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          currentLevel: updateProgressDto.currentLevel,
          scoreTotal: updateProgressDto.totalScore,
          lastGamePlayed: new Date(),
        },
      },
      { new: true, upsert: true },
    );
    return this.progressModel.findOne({ user: userId });
  }
}
