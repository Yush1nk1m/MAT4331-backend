import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KBOTeam } from 'src/common/types/KBO-team.enum';

@Schema()
export class PitchStats extends Document {
  @Prop({ required: true })
  game_id: string;

  @Prop({ type: String, enum: KBOTeam, required: true })
  team: KBOTeam;

  @Prop({ type: Date, required: true })
  game_date: Date;

  @Prop({ required: true })
  IP: number;

  @Prop({ required: true })
  TBF: number;

  @Prop({ required: true })
  H: number;

  @Prop({ required: true })
  R: number;

  @Prop({ required: true })
  ER: number;

  @Prop({ required: true })
  BB: number;

  @Prop({ required: true })
  HBP: number;

  @Prop({ required: true })
  K: number;

  @Prop({ required: true })
  HR: number;

  @Prop({ required: true })
  GO: number;

  @Prop({ required: true })
  FO: number;

  @Prop({ required: true })
  NP: number;

  @Prop({ required: true })
  S: number;

  @Prop({ required: true })
  IR: number;

  @Prop({ required: true })
  IS: number;

  @Prop({ required: true })
  GSC: number;

  @Prop({ required: true })
  ERA: number;

  @Prop({ required: true })
  WHIP: number;

  @Prop({ required: true })
  LI: number;

  @Prop({ required: true })
  WPA: number;

  @Prop({ required: true })
  RE24: number;
}

export const PitchStatsSchema = SchemaFactory.createForClass(PitchStats);
