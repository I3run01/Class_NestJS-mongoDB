import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    
  @Prop({type:Object})
  taskOne: {
    email: string | null
    password: string | null
    token: string | null
  };

  @Prop({type:Object})
  taskThree: {
    id: string | null
    hash: string | null
    imageRouter: string | null
    imageCode64: string | null
  }
};

export const UserSchema = SchemaFactory.createForClass(User);