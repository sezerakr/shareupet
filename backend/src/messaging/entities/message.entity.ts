import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message extends CoreEntity<number> {
  @Column()
  content: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}
