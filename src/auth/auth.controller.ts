import {
    Body,
    Controller,
    Post,
    Request,
    Res,
    HttpStatus,
    UseGuards,
    ValidationPipe,
  } from '@nestjs/common';
import { AuthService } from "./auth.service"

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller()
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('/signup')
    async signUp(
      @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
      return await this.authService.signUp(authCredentialsDto);
    }
  
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Res() res, @Request() req) {
      const result = this.authService.signIn(req.user);
      return res.status(HttpStatus.OK).json({
        message: 'Successfully login',
        result
      });
    }
  
}