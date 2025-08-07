import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Post('signup')
  signup(
    @Body()
    body: {
      email: string;
      password: string;
      nickname: string;
      avatarUrl: string;
    },
  ) {
    //TODO check if body is not missing any required fields

    return this.authService.signUp(body);
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Request() req) {
    return this.authService.login(loginUserDto);
  }
}
