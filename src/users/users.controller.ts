import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt'
import * as base64 from 'base64-js';

let  reqresUserRequest = async (id:string) => {  
  let response = await fetch(`https://reqres.in/api/users/${id}`)
  let json = await response.json()

  return json.data
}

async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const encodedImage = base64.fromByteArray(bytes);
  return encodedImage;
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await reqresUserRequest(id);
  }

  @Get(':id/avatar')
  async saveImage(@Param('id') id: string) {
    let userInDatabase = await this.usersService.findOne(id);

    if(userInDatabase) {
      return {token: userInDatabase.token}
    }

    let reqreUser = await reqresUserRequest(id)

    let createUserDto: CreateUserDto = {
      email: reqreUser.email,
      firstName: reqreUser.firstName,
      id: id,
      imageInBase64: await imageToBase64(reqreUser.avatar),
      lastName: reqreUser.lastName,
      password: '',
      token: await hash(reqreUser.email, 10),
    }
    return this.usersService.create(createUserDto);

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
