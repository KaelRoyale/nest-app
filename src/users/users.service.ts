import { Inject, Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose"
import { MAX_ATTEMPTS } from './constants/users.constants'
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }




  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const query: any = { user: new mongoose.Types.ObjectId(id) }
    return this.userModel.findById(query).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByUsername(username: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ where: { username } }).exec();
    }
    catch (error) {
      throw new NotFoundException('Can not find user');
    }
    return user;
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<User | null> {
    console.log(username);
    const user = await this.userModel.findOne({ "username": username }).exec();

    console.log(user);
    if (user == null) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.isLocked) {
      return null;
    }
    // compare passwords
    const areEqual = await bcrypt.compare(password, user.password);

    if (!areEqual) {
      let currentAttempts = user.failedAttemps;
      currentAttempts++;
      if (currentAttempts == MAX_ATTEMPTS) {
        user.isLocked = true;
      }
      user.failedAttemps = currentAttempts;
      user.save();
      return null;
    }

    return user;
  }

}
