import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment extends CoreEntity<number> {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
