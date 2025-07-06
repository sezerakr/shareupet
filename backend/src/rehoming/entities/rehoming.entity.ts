import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { CoreEntity } from '../../core/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Rehoming extends CoreEntity<number> {
  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.rehomingRequests)
  requestingUser: User;

  @Column({ default: false })
  isApproved: boolean;
}
