import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
