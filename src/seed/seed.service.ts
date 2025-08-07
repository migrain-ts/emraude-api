import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Match, MatchStatus } from '../match/entities/match.entity';
import { Progress } from '../progress/entities/progress.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Match.name) private matchModel: Model<Match>,
  ) {}
  async seedAll() {
    await this.userModel.deleteMany();
    await this.progressModel.deleteMany();
    await this.matchModel.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await this.userModel.insertMany([
      { email: 'pierre@example.com', nickname: 'pierre-menez', hashedPassword },
      { email: 'bernard@example.com', nickname: 'nanard', hashedPassword },
      { email: 'claude@example.com', nickname: 'clauclau', hashedPassword },
    ]);

    const progresses = await Promise.all(
      users.map((user, i) =>
        this.progressModel.create({
          user: user._id,
          currentLevel: i + 1,
          scoreTotal: 1000 + i * 500,
          lastGamePlayed: new Date(),
        }),
      ),
    );

    const match = await this.matchModel.create({
      player1Id: users[0]._id,
      player2Id: users[1]._id,
      state: MatchStatus.FINISHED,
      winnerId: users[0]._id,
      createdAt: new Date(),
    });

    return {
      users,
      progresses,
      match,
    };
  }
}
