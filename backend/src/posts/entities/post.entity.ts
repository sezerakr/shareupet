import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { Share } from '../../shares/entities/share.entity';

@Entity()
export class Post extends CoreEntity<number> {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @ManyToOne(() => Pet, (pet) => pet.posts, { nullable: true })
  pet: Pet;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Share, (share) => share.post)
  shares: Share[];
}
