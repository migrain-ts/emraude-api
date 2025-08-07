import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export enum MatchStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Match {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  player1Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  player2Id: Types.ObjectId;

  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.WAITING })
  state: MatchStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  winnerId: Types.ObjectId;

  @Prop()
  createdAt: Date;
}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match);
