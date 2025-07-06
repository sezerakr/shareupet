import { Entity, Column, OneToMany } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from 'src/core/enums/role.enum';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { Share } from '../../shares/entities/share.entity';
import { Rehoming } from '../../rehoming/entities/rehoming.entity';

@Entity()
export class User extends CoreEntity<number> {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

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

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[];

  @OneToMany(() => Pet, (pet) => pet.creator)
  pets: Pet[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Share, (share) => share.user)
  shares: Share[];

  @OneToMany(() => Rehoming, (rehoming) => rehoming.requestingUser)
  rehomingRequests: Rehoming[];

  fromSwagger: boolean;
}
