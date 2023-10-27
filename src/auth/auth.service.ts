import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dtos/auth_register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}
  createToken(user: users) {
    return {
      accessToken: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles,
      }),
    };
  }
  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token);
      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const status = await bcrypt.compare(password, user.password);
    if (!status) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    return this.createToken(user);
  }
  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Email does not exist');
    }
    const token = await this.jwtService.sign({
      id: user.id,
    });

    await this.mailer.sendMail({
      subject: 'Password recovery',
      to: 'josenildo@seuemail.com',
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });
    return user;
  }
  async reset(password: string, token: string) {
    const { id } = await this.checkToken(token);
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
    return this.createToken(user);
  }
  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
