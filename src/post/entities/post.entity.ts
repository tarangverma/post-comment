import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Title of the post',
  })
  title: string;

  @Column('text', {
    nullable: false,
    comment: 'Main content of the post',
  })
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of post creation',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Timestamp of last update',
  })
  updatedAt: Date;

  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
    comment: 'ID of the user who created the post',
  })
  userId: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates if the post has been edited',
  })
  isEdited: boolean;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    eager: false,
  })
  comments: Comment[];
}
