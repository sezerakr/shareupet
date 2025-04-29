import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, password } = createUserDto;

        // Check if user already exists
        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            role: UserRole.USER, // Default role
        });

        return this.usersRepository.save(user);
    }

    async setAdmin(userId: number): Promise<User> {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.role = UserRole.ADMIN;
        return this.usersRepository.save(user);
    }
}