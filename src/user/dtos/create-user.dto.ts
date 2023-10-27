import { IsString, IsEmail, IsStrongPassword, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/enums/role.enum';
export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  roles: number;
}
