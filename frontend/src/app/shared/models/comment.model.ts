
import { User } from './user.model';
import { Post } from './post.model';

export interface AppComment {
  id: number;
  content: string;
  author: User;
  post: Post;
}
