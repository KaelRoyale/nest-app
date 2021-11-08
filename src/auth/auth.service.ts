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
import { LoginStatus } from './interfaces/login-status.interface';
import * as bcrypt from "bcrypt"
import { ok } from 'assert';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {

    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;
        const user = new this.userModel({ username, password: password });

        try {
            await user.save();
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus | null> {
        // find user in db
        const user = await this.usersService.findByLogin(loginUserDto);

        if (user == null) {
            return {
                success: false
            };
        }

        else {
            // generate and sign token
            const token = this.createJwtPayload(user);

            return {
                username: user.username,
                success: true,
                ...token,
            };
        }
    }



    async validateUser(username: string, password: string): Promise<User> {

        console.log("Auth Validate");
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

    private createJwtPayload({ username }: User): any {

        let data: JwtPayload = {
            username: username
        };

        let jwt = this.jwtService.sign(data);

        return {
            expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
            accessToken: jwt
        }

    }




    public getCookieWithJwtToken(username: string, email: string) {
        const payload: JwtPayload = { username };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

}
