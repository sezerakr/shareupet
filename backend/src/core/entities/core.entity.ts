import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class CoreEntity<T> {
  @PrimaryGeneratedColumn()
  id: T;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @Column({ nullable: true })
  created_by: T;

  @Column({ nullable: true })
  updated_by: T;

  @Column({ nullable: true })
  deleted_by: T | null;
}
