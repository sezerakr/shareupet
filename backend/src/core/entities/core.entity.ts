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

  @Column({ nullable: true, type: 'int' })
  created_by: T;

  @Column({ nullable: true, type: 'int' })
  updated_by: T;

  @Column({ nullable: true, type: 'int' })
  deleted_by: T | null;
}