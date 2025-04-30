import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from 'src/core/enums/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    @Column({ nullable: true, type: 'date' })
    birthdate: Date;

    @Column({ nullable: true })
    googleId: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    avatar: string;

    @OneToMany(() => Pet, pet => pet.creator)
    pets: Pet[];

    fromSwagger: boolean;
}