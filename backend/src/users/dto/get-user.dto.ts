import { Role } from 'src/core/enums/role.enum';

export class GetUserDto {
  username: string;
  email: string;
  role: Role;
  displayName: string;
  avatar: string;
  birthdate: Date;
}
