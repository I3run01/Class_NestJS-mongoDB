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

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
