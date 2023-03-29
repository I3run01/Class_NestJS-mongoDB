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
    createUserDto.password = await hash('createUserDto.password', 10)
    return this.userModel.create(createUserDto);
  }

  async findOne(id: string) {
    let response = await fetch(`https://reqres.in/api/users/${id}`)
    let responseInJson = await response.json()
    return await responseInJson.data
  }

  async saveImage(id: string) {

    let hasUser = await this.userModel.findOne({id:id})
    if(hasUser !== null) {
      console.log(hasUser)
      return {status: 'user exists'}
      
    }

    let response = await fetch(`https://reqres.in/api/users/${id}`)
    let responseInJson = await response.json()
    let responseDatas = await responseInJson.data

    let token =  String(await hash(responseDatas.email, 10))

    return this.userModel.create({
      token: token,
      imageInBase64: responseDatas.avatar,
      id: responseDatas.id
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
