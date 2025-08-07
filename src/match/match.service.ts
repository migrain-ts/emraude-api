import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchStatus } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
  ) {}

  async createMatch(player1id: string, player2id: string) {
    const match = new this.matchModel({
      player1Id: player1id,
      player2Id: player2id,
      state: MatchStatus.WAITING,
    });
    return match.save();
  }
  async getMatchById(matchId: string) {
    return this.matchModel
      .findById(matchId)
      .populate('player1Id', 'nickname email')
      .populate('player2Id', 'nickname email')
      .populate('winnerId', 'nickname email')
      .lean();
  }

  async setMatchResult(matchId: string, winnerId: string) {
    const updatedMatch = await this.matchModel.findByIdAndUpdate(
      matchId,
      {
        winnerId,
        state: MatchStatus.FINISHED,
      },
      { new: true },
    );

    return updatedMatch;
  }
}
