import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findOne(id: string) {
    let user = this.userModel.findOne({
      'taskThree.id':id
    })

    if(user) {
      return user
    }
    return null
  }

  async remove(id: string) {
    
    try {
      await this.userModel.deleteOne({
        'taskThree.id': id
      })
      return { status: `user of the id ${id} was removed` };

    } catch (error) {
        console.error(`Error removing user with ID ${id}: ${error.message}`);
        throw error;
    }
  }
}
