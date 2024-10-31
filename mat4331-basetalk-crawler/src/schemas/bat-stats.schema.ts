import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BatStats extends Document {
  @Prop({ required: true })
  PA: number;

  @Prop({ required: true })
  AB: number;

  @Prop({ required: true })
  R: number;

  @Prop({ required: true })
  H: number;

  @Prop({ required: true })
  HR: number;

  @Prop({ required: true })
  RBI: number;

  @Prop({ required: true })
  BB: number;

  @Prop({ required: true })
  HBP: number;

  @Prop({ required: true })
  SO: number;

  @Prop({ required: true })
  GO: number;

  @Prop({ required: true })
  FO: number;

  @Prop({ required: true })
  NP: number;

  @Prop({ required: true })
  GDP: number;

  @Prop({ required: true })
  LOB: number;

  @Prop({ required: true })
  ABG: number;

  @Prop({ required: true })
  OPS: number;

  @Prop({ required: true })
  LI: number;

  @Prop({ required: true })
  WPA: number;

  @Prop({ required: true })
  RE24: number;
}

export const BatStatsSchema = SchemaFactory.createForClass(BatStats);
