import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthForgetDTO } from './dtos/auth_forget.dto';
import { AuthLoginDTO } from './dtos/auth_login.dto';
import { AuthRegisterDTO } from './dtos/auth_register.dto';
import { AuthResetDTO } from './dtos/auth_reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.authService.register(data);
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }
  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }
  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }
  @UseGuards(AuthGuard)
  @Post('test')
  test(@User() data) {
    return data;
  }
}
