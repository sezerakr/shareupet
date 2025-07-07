
import { User } from './user.model';

export interface Message {
  id: number;
  content: string;
  author: User;
  conversationId: number;
}
