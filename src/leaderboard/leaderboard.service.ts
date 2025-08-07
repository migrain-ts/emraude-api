import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../progress/entities/progress.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
  ) {}

  async getTop10Players() {
    const topPlayers = await this.progressModel
      .find()
      .sort({ scoreTotal: -1 })
      .populate('user', 'nickname')
      .limit(10);
    return topPlayers;
  }
}
