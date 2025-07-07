
import { Post } from './post.model';
import { User } from './user.model';

export interface Rehoming {
  id: number;
  post: Post;
  requestingUser: User;
  isApproved: boolean;
}
