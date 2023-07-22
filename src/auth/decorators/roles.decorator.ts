import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../common/enums/roles.enum';

export const ROLES_METADATA_KEY = 'roles';

export const Roles = (...args: RolesEnum[]) =>
  SetMetadata(ROLES_METADATA_KEY, args);
