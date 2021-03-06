import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {


  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: Date;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  lastFailedAttempts: Date;
  
  @Prop({ default: 0 })
  failedAttemps: number;

  @Prop({ default: false })
  isLocked: Boolean

}

export const UserSchema = SchemaFactory.createForClass(User);