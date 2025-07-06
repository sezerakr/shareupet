import { Entity, Column, OneToMany } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { PetType } from 'src/core/enums/pettype.enum';
import { CoreEntity } from 'src/core/entities/core.entity';

@Entity()
export class Breed extends CoreEntity<number> {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PetType,
    default: PetType.OTHER,
  })
  petType: PetType;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets: Pet[];
}
