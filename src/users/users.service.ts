import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcrypt'
import * as base64 from 'base64-js';

async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const encodedImage = base64.fromByteArray(bytes);
  return encodedImage;
}

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
      return {hasUser}
      
    }

    let response = await fetch(`https://reqres.in/api/users/${id}`)
    let responseInJson = await response.json()
    let responseDatas = await responseInJson.data

    let token =  String(await hash(responseDatas.email, 10))
    let encoded64 = await imageToBase64(responseDatas.avatar)
    console.log(encoded64)

    return this.userModel.create({
      token: token,
      imageInBase64: encoded64,
      id: responseDatas.id
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
