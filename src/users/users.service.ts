import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcrypt'




@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, 10)
    return this.userModel.create(createUserDto);
  }

  async findOne(id: string) {
    let user = this.userModel.findOne({id:id})
    if(user) {
      return user
    }
    return null
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
