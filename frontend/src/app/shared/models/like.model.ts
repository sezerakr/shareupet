
import { User } from './user.model';
import { Post } from './post.model';

export interface Like {
  id: number;
  user: User;
  post: Post;
}
