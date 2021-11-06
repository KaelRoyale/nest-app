import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({default: new Date().toISOString()})
  createdAt: Date;

  @Prop({default: 0})
  failedAttemps: number;

  
}

export const UserSchema = SchemaFactory.createForClass(User);