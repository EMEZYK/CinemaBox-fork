import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from 'src/app/declarations/isPublic';
import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { CreateUserDto } from './dto/user.create.dto';

import { UserService } from './User.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    const response = await this.userService.getUser(id);

    if (!response) {
      throw new HttpException(ResponseDictionary.userNotFound, 404);
    }

    return {
      user: response,
    };
  }

  @Get()
  async getUsers() {
    const response = await this.userService.getUsers();

    if (!response) {
      throw new HttpException(ResponseDictionary.usersError, 404);
    }

    return {
      users: response,
      count: response.length,
    };
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { isError, data } = await this.userService.createUser(createUserDto);

    if (isError) {
      throw new HttpException(ResponseDictionary.userNotCreated, 400);
    }

    return {
      id: data.data.id,
    };
  }
}
