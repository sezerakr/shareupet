
import { User } from './user.model';
import { Message } from './message.model';

export interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
}
