import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from "./auth.service"

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }


  @Post('/signin')

  async signIn(@Res() res, @Body() req: LoginUserDto) {
    const result = this.authService.login(req);


    console.log(result);
    if (result == null) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Oops! Something wrong with your login"
      })
    }
    else {
      result.then(value => {
        return res.status(HttpStatus.OK).json({
          message: 'Successfully login',
          value
        });
      })
    }

  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async testAuth(@Req() req): Promise<JwtPayload> {
    return req.user;
  }
}