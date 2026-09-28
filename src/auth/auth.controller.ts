import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {LoginDto} from './auth.dto';
import {JwtAuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {
  }

  @Post('login') login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me') @UseGuards(JwtAuthGuard) me(@Req() request: any) {
    return this.auth.findById(request.user.sub);
  }
}

