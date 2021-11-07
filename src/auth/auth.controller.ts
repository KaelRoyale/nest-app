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
  Param,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from "./auth.service"

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UpdateUserInput } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) { }
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }


  @Post('/signin')

  async signIn(@Res() res, @Body() req: LoginUserDto) {
    const result = this.authService.login(req);

    
      result.then((value) => {
        if (value.success) 
        return res.status(HttpStatus.OK).json({
          message: 'Successfully login',
          value
        });
      
      else 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Oops! Something wrong with your login"
        });
      
      });
      
    

  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  public async testAuth(@Req() req): Promise<JwtPayload> {
    return req.user;
  }

  @Post('unlock/:username')
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['admin'])
  public async unlockUser(@Param('username') accountUserName: string, @Body() body: UpdateUserInput) {
    let user = this.userService.findOneByUsername(accountUserName);
    if (user)
    {

    }
  }
}