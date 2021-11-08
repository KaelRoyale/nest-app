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

  async update(id: number, updateUserDto: UpdateUserDto) {
     await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
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
    console.log(username + " " + password);
    const user = await this.userModel.findOne({ "username": username }).exec();

    if (user == null) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.isLocked) {
      return null;
    }
    else {
      // compare passwords
      const areEqual = await bcrypt.compare(password, user.password);
 
      if (!areEqual) {

        let currentAttempts = user.failedAttemps;
        if (currentAttempts === 0) {
          //increase
          currentAttempts++;
          user.lastFailedAttempts = new Date();
        }
        else if (currentAttempts == MAX_ATTEMPTS) {
          user.isLocked = true;
        }
        else {
          let current = new Date();
          let diffMs = (current.getTime() - user.lastFailedAttempts.getTime());
          let diffMins = Math.round(diffMs / 60000);
          if (diffMins > 5) //if last fail > 5 mins? update lastFailAttempts and number of fail
          {
           
            user.lastFailedAttempts = new Date();
            currentAttempts = 1;
          }
          else {
     
            currentAttempts++;
          }
        }

        user.failedAttemps = currentAttempts;
        user.save();
        return null;
      }

      else {
       
        //Reset failed attempts field
        user.lastFailedAttempts = null;
        user.failedAttemps = 0;
        user.lastLoginAt = new Date();
        user.save();
        return user;
      }
    }
  }

}
