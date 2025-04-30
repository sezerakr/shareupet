import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity()
export class Breed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Pet, pet => pet.breed)
    pets: Pet[];
}