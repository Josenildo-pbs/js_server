import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userSevice: UserService,
    private readonly prisma: PrismaService,
  ) {}
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userSevice.create(data);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get()
  async list() {
    return this.userSevice.readAll();
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    this.exist(id);
    return this.userSevice.read(id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateUserDTO,
  ) {
    this.exist(id);
    return this.userSevice.update(id, data);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    this.exist(id);
    return this.userSevice.updatePartial(id, data);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    this.exist(id);
    return this.userSevice.delete(id);
  }
  async exist(id: number) {
    if (
      !(await this.prisma.users.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException('The user does not exit');
    }
  }
}
