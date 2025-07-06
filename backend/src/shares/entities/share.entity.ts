import { Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Share extends CoreEntity<number> {
  @ManyToOne(() => User, (user) => user.shares)
  user: User;

  @ManyToOne(() => Post, (post) => post.shares)
  post: Post;
}
