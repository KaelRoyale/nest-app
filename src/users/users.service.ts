import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }




  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: number): Promise<User>{
    return this.userModel.findById(id).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(username: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ "username": username }).exec();
    }
    catch (error) {
      throw new NotFoundException('Can not find user');
    }
    return user;
  }
}
