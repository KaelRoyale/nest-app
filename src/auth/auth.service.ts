import { Injectable, Param, UnauthorizedException, Body, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from "../users/users.service";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User, UserDocument } from "../users/user.schema"
import { Model } from "mongoose"
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {

    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({ username, password: hashedPassword });

        try {
            await user.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    async signIn(user: User) {
        const payload = { username: user.username };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }


    async validateUser(username: string, password: string): Promise<User> {

        // This will be used for the initial login
        const user = await this.userModel.findOne({ username });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (valid) {
            //Check if password match
            //Reset failed count
            user.failedAttemps = 0;
            await user.save();
            return user;
        }
        else {
            // Check if not match password
            user.failedAttemps++;
            return null;
        }

    }

    createJwtPayload(user) {

        let data: JwtPayload = {
            username: user.username
        };

        let jwt = this.jwtService.sign(data);

        return {
            expiresIn: 3600,
            token: jwt
        }

    }




    public getCookieWithJwtToken(username: string, email: string) {
        const payload: JwtPayload = { username };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

}
