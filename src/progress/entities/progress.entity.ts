import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema()
export class Progress {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ default: 1 })
  currentLevel: number;

  @Prop({ default: 0 })
  scoreTotal: number;

  @Prop({ default: Date.now })
  lastGamePlayed: Date;
}

export type ProgressDocument = Progress & Document;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
