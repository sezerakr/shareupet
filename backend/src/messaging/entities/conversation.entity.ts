import { Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation extends CoreEntity<number> {
  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
