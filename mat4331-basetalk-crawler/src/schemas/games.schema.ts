import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { GameStatus } from './types/game-status.enum';
import { KBOTeam } from './types/KBO-team.enum';
import { BatStats } from './bat-stats.schema';
import { PitchStats } from './pitch-stats.schema';

@Schema()
export class Games extends Document {
  @Prop({ required: true, unique: true })
  game_id: string;

  @Prop({ type: Date, required: true })
  game_date: Date;

  @Prop({ type: String, enum: KBOTeam, required: true })
  home_team: KBOTeam;

  @Prop({ type: String, enum: KBOTeam, required: true })
  away_team: KBOTeam;

  @Prop()
  home_score: number;

  @Prop()
  away_score: number;

  @Prop({ type: String, enum: GameStatus, required: true })
  game_status: GameStatus;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'BatStats' })
  bat_stats_home: BatStats;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'BatStats' })
  bat_stats_away: BatStats;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'PitchStats' })
  pitch_stats_home: PitchStats;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'PitchStats' })
  pitch_stats_away: PitchStats;
}

export const GameSchema = SchemaFactory.createForClass(Games);
