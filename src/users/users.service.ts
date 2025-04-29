import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/core/enums/role.enum';

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

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, password } = createUserDto;

        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            role: Role.USER,
        });

        return this.usersRepository.save(user);
    }

    async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (updateUserDto.password) {
            const saltRounds = 10;
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async setAdmin(userId: number): Promise<User> {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.role = Role.ADMIN;
        return this.usersRepository.save(user);
    }
}