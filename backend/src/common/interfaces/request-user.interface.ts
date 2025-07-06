import { Role } from 'src/core/enums/role.enum';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';

export interface RequestUser {
  userId: number;
  username: string;
  role: Role;
  displayName?: string;
  avatar?: string;
  permissions?: UserPermissions[];
  fromSwagger?: boolean;
}
