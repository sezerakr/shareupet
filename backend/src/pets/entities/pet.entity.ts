import { Breed } from 'src/breeds/entities/breed.entity';
import { CoreEntity } from 'src/core/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { PetType } from '../../core/enums/pettype.enum';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Pet extends CoreEntity<number> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: PetType,
    default: PetType.OTHER,
  })
  type: PetType;

  @ManyToOne(() => Breed)
  breed: Breed;

  @Column()
  color: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.pets)
  creator: User;

  @Column()
  creatorId: number;

  @OneToMany(() => Post, (post) => post.pet)
  posts: Post[];
}
