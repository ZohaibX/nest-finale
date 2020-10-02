import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { Task } from '../tasks/task.entity';
import { ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
@Unique(['username']) // we will add the title of the columns we want to be unique
export class Auth extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string; // just to save salt

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.hash(password, this.salt);
    return hashPassword === this.password;
  }

  @Column()
  tasks : string[];
}
