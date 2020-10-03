import { ObjectIdColumn, Column, Entity, PrimaryColumn } from 'typeorm';
import { StudentLevel } from './enum/student.level';

@Entity()
export class Student {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  status: StudentLevel;

  @Column()
  userId: string;
}
