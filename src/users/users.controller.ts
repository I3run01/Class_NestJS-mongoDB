import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import * as complamentaryFunctions from '../Functions/functions';


@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData:{email: string, password: string}) {

    let userDTO: CreateUserDto = {
      taskOne: {
        email: userData.email,
        password: await hash(userData.password, 10),
        token: await hash(userData.email, 10),
      },
      taskThree: {
        id: null,
        imageRouter: null,
        hash: null,
        imageCode64: null
      }
    }

    complamentaryFunctions.sendEmail('brunnooa.v@gmail.com','testEmail',"I'm junst testing")

    return await this.usersService.create(userDTO);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await complamentaryFunctions.reqresUserRequest(id);
  }

  @Get(':id/avatar')
  async saveImage(@Param('id') id: string) {
    let userInDatabase = await this.usersService.findOne(id);

    if(userInDatabase) {
      let imageEncode64 = userInDatabase.taskThree.imageCode64
      return {encode64: imageEncode64}
    }

    let reqreUser = await complamentaryFunctions.reqresUserRequest(id)
    let imageRouter = `./uploads/images/img${reqreUser.id}.jpg`;
    await complamentaryFunctions.saveImageFromUrl(reqreUser.avatar, imageRouter)

    let imageEncode64 = await complamentaryFunctions.encodeImageToBase64(imageRouter)

    let userDTO: CreateUserDto = {
      taskOne: {
        email: null,
        password: null,
        token: null
      },
      taskThree: {
        id: id,
        imageRouter: imageRouter,
        hash: String(await hash(reqreUser.email, 10)),
        imageCode64: imageEncode64
      }
      
    }

    await this.usersService.create(userDTO)
    return {encoded64: imageEncode64};

  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    let userInDatabase = await this.usersService.findOne(id);

    if (!userInDatabase) {
      complamentaryFunctions.deleteImageFromID(id);
      return { status: 'User does not exist in database' };
    } 

    let imageRouter = userInDatabase.taskThree.imageRouter;
    if (imageRouter) {
      complamentaryFunctions.deleteImage(imageRouter);
    } else {
      complamentaryFunctions.deleteImageFromID(id);
    }

    return this.usersService.remove(id);
  }
}
