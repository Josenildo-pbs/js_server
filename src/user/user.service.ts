import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ email, name, password }: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return this.prisma.users.create({
      data: {
        email,
        name,
        password,
      },
    });
  }
  async readAll() {
    return this.prisma.users.findMany();
  }
  async read(id: number) {
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }
  async update(id: number, data: CreateUserDTO) {
    return this.prisma.users.update({
      data,
      where: {
        id,
      },
    });
  }
  async updatePartial(id: number, { name, email, password }: UpdateUserDTO) {
    const data: any = {};
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt);
    }
    return this.prisma.users.update({
      data,
      where: {
        id,
      },
    });
  }
  async delete(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
