import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: string

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  imageInBase64: string;

}

export const UserSchema = SchemaFactory.createForClass(User);