import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import MongoClassSerializerInterceptor from "./interceptors/users.interceptors"

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all users.' })
  @ApiOkResponse({ description : 'Successfully return all users'})
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get user by Id.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update a user'})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
