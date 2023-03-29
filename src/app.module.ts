import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, 'mongodb+srv://Bruno:<password>@databases.i735gb3.mongodb.net/?retryWrites=true&w=majority'],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
