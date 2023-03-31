import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      'taskThree.id': id,
    });

    return user || null;
  }

  async remove(id: string) {
    try {
      await this.userModel.deleteOne({
        'taskThree.id': id,
      });

      return { status: `User with ID ${id} was removed` };
    } catch (error) {
      console.error(`Error removing user with ID ${id}: ${error.message}`);
      throw error;
    }
  }
}
