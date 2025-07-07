
import { User } from './user.model';
import { Post } from './post.model';

export interface Share {
  id: number;
  user: User;
  post: Post;
}
