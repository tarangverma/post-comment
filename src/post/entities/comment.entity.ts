import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    comment: 'The content of the comment',
  })
  text: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of comment creation',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of last update',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: 'ID of the user who created the comment',
  })
  userId: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates if the comment has been edited',
  })
  isEdited: boolean;

  @Column('uuid')
  postId: string;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
