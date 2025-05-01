import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/core/enums/role.enum';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { GetUserDto } from './dto/get-user.dto';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user || undefined;
    }

    async findById(id: number): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { id } });
        return user || undefined;
    }

    async findByEmail(email: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.usersRepository.findOne({ where: { email } });
            if (!user) {
                return {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                };
            }

            return {
                success: true,
                data: user,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Error finding user by email',
                    code: 'FIND_USER_ERROR',
                    details: error.message,
                },
            };
        }
    }

    async findByGoogleId(googleId: string): Promise<ApiResponse<User>> {
        try {
            const user = await this.usersRepository.findOne({ where: { googleId } });
            if (!user) {
                return {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                };
            }

            return {
                success: true,
                data: user,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Error finding user by Google ID',
                    code: 'FIND_USER_ERROR',
                    details: error.message,
                },
            };
        }
    }

    async create(createUserDto: CreateUserDto): Promise<ApiResponse<GetUserDto>> {
        try {
            const { username, email, password, birthdate } = createUserDto;

            const existingUser = await this.findOne(username);
            if (existingUser) {
                return {
                    success: false,
                    error: {
                        message: 'Username already exists',
                        code: 'USERNAME_EXISTS',
                    },
                };
            }

            const emailCheck = await this.findByEmail(email);
            if (emailCheck.success) {
                return {
                    success: false,
                    error: {
                        message: 'Email already exists',
                        code: 'EMAIL_EXISTS',
                    },
                };
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = this.usersRepository.create({
                username,
                email,
                password: hashedPassword,
                birthdate,
                role: Role.USER,
                permissions: this.getDefaultPermissions(Role.USER),
            });

            const savedUser = await this.usersRepository.save(user);
            const returnedUser = new GetUserDto();
            returnedUser.username = savedUser.username;
            returnedUser.email = savedUser.email;
            returnedUser.role = savedUser.role;
            returnedUser.displayName = savedUser.displayName;
            returnedUser.avatar = savedUser.avatar;
            returnedUser.birthdate = savedUser.birthdate;
            return {
                success: true,
                data: returnedUser,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Failed to create user',
                    code: 'CREATE_USER_ERROR',
                    details: error.message,
                },
            };
        }
    }

    async createFromGoogle(googleUser: any): Promise<ApiResponse<User>> {
        try {
            const userRole = Role.USER;
            const user = this.usersRepository.create({
                username: googleUser.username,
                email: googleUser.email,
                googleId: googleUser.googleId,
                displayName: googleUser.displayName,
                avatar: googleUser.avatar,
                role: userRole,
                permissions: this.getDefaultPermissions(userRole),
            });

            const savedUser = await this.usersRepository.save(user);
            return {
                success: true,
                data: savedUser,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Failed to create user from Google',
                    code: 'CREATE_GOOGLE_USER_ERROR',
                    details: error.message,
                },
            };
        }
    }

    async update(id: number, updateUserDto: any): Promise<ApiResponse<User>> {
        try {
            const user = await this.findById(id);
            if (!user) {
                return {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                };
            }

            if (updateUserDto.password) {
                const saltRounds = 10;
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
            }

            Object.assign(user, updateUserDto);
            const updatedUser = await this.usersRepository.save(user);

            return {
                success: true,
                data: updatedUser,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Failed to update user',
                    code: 'UPDATE_USER_ERROR',
                    details: error.message,
                },
            };
        }
    }

    async setAdmin(userId: number): Promise<ApiResponse<User>> {
        try {
            const user = await this.findById(userId);
            if (!user) {
                return {
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                };
            }

            user.role = Role.ADMIN;
            const updatedUser = await this.usersRepository.save(user);

            return {
                success: true,
                data: updatedUser,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: 'Failed to set admin role',
                    code: 'SET_ADMIN_ERROR',
                    details: error.message,
                },
            };
        }
    }

    public getDefaultPermissions(role: Role): UserPermissions[] {
        switch (role) {
            case Role.ADMIN:
                return Object.values(UserPermissions);
            case Role.MOD:
                return [
                    UserPermissions.CreatePets,
                    UserPermissions.CreateComments,
                    UserPermissions.ListPets,
                    UserPermissions.ListComments,
                    UserPermissions.DeletePets,
                    UserPermissions.DeleteComments,
                    UserPermissions.EditPets,
                    UserPermissions.EditComments,
                    UserPermissions.DeleteComments
                ];
            case Role.USER:
            default:
                return [UserPermissions.CreatePets, UserPermissions.CreateComments];
        }
    }

}