import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import * as utils from '../Utils/functions';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: { email: string; password: string }) {
    const hashedPassword = await hash(userData.password, 10);
    const hashedEmail = await hash(userData.email, 10);

    const userDTO: CreateUserDto = {
      taskOne: {
        email: userData.email,
        password: hashedPassword,
        token: hashedEmail,
      },
      taskThree: {
        id: null,
        imageRouter: null,
        hash: null,
        imageCode64: null,
      },
    };

    //utils.sendEmail('brunnooa.v@gmail.com','account created',"account has been created");

    await utils.createRabbitEvent(`user ${userData.email} has been created`, 'anyRoutingKey')

    return await this.usersService.create(userDTO);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await utils.reqresUserRequest(id);
  }

  @Get(':id/avatar')
  async saveImage(@Param('id') id: string) {

      let userInDatabase = await this.usersService.findOne(id);
      let imageRouter:string, imageEncode64:string | null;

      if (userInDatabase) {
        return {encoded64: userInDatabase.taskThree.imageCode64};
      }
      
      const reqreUser = await utils.reqresUserRequest(id);
      imageRouter = `./uploads/images/img${reqreUser.id}.jpg`;
      await utils.saveImageFromUrl(reqreUser.avatar, imageRouter);
  
      imageEncode64 = await utils.encodeImageToBase64(imageRouter);
  
      const userDTO: CreateUserDto = {
        taskOne: {
          email: null,
          password: null,
          token: null,
        },
        taskThree: {
          id: id,
          imageRouter: imageRouter,
          hash: String(await hash(reqreUser.email, 10)),
          imageCode64: imageEncode64,
        },
      };
      await this.usersService.create(userDTO);
      return { encoded64: imageEncode64 };
    
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    let userInDatabase = await this.usersService.findOne(id);

    if (!userInDatabase) {
      utils.deleteImageFromID(id);
      return { status: 'User does not exist in database' };
    }

    let imageRouter = userInDatabase.taskThree.imageRouter;

    if (imageRouter) {
      utils.deleteImage(imageRouter);
    } else {
      utils.deleteImageFromID(id);
    }

    return this.usersService.remove(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: {newHash: string}) {
      console.log(updateData)
      return await this.usersService.updateHash(id, updateData.newHash)
  }
}
