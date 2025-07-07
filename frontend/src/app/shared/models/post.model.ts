
import { User } from './user.model';
import { Like } from './like.model';
import { AppComment } from './comment.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  author: User;
  likes?: Like[];
  comments?: AppComment[];
  // Omitting pet, shares for now to keep it simple
}
