
import { User } from './user.model';

export interface Pet {
  id: number;
  name: string;
  description: string;
  age: number;
  type: string;
  breed: any; // Simplified for now
  color: string;
  image?: string;
  creator: User;
}
