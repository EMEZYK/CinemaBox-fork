import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import ResponseDictionary from 'src/app/dictionaries/Response.dictionary';
import { CreateUserDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserService } from './User.service';
import { Public } from "src/app/declarations/isPublic";

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getMe(@Req() req: Request) {
    return this.userService.getMe(req.headers.authorization);
  }

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

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    const response = await this.userService.updateUser(id, userUpdateDto);

    if (!response) {
      throw new HttpException(ResponseDictionary.userNotUpdated, 400);
    }

    return {
      message: ResponseDictionary.userUpdated,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const { isError } = await this.userService.deleteUser(id);

    if (isError) {
      throw new HttpException(ResponseDictionary.userNotDeleted, 400);
    }

    return {
      message: ResponseDictionary.userDeleted,
    };
  }
}
