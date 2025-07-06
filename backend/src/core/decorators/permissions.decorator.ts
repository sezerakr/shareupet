import { SetMetadata } from '@nestjs/common';
import { UserPermissions } from '../enums/userpermissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: UserPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
