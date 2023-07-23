import { PartialType } from '@nestjs/mapped-types';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  password?: string;
  role?: Array<string>;
}
