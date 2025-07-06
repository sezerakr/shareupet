import { Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Like extends CoreEntity<number> {
  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}
