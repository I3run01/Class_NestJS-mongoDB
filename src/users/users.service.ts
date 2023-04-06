import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

    if (!user) {
     return(null);;
    }
    return user
  }

  async remove(id: string) {
      return await this.userModel.deleteOne({
        'taskThree.id': id,
      });
  }

  async updateHash(id: string, hash: string): Promise<any> {

    let user = await this.findOne(id)

    if(!user) {
      return {response: 'User does not exist'}
    }

    user.set({
      'taskThree.hash': hash
    })
    await user.save()

    return user
  }

}
