import { ObjectIdColumn, Column, Entity, PrimaryColumn } from 'typeorm';
import { TaskStatus } from './enum/status.enum';

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  status: TaskStatus;

  @Column()
  createdAt: string;

  @Column()
  userId: string;

  @Column()
  students: string[];
}

// we need to provide this entity file to app module and module file of this folder
