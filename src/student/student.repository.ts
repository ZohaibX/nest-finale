import { EntityRepository, Repository } from 'typeorm';
import { Student } from './student.entity';
import { Task } from './../task/task.entity';
import { v4 as uuid } from 'uuid';
import { StudentLevel } from './enum/student.level';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Student)
export class StudentRepo extends Repository<Student> {
  async getStudents(studentIds: string[]): Promise<Student[]> {
    return this.find({
      where: {
        id: {
          $in: studentIds,
        },
      },
    });
  }

  async getStudent(id: string, studentIds: string[]): Promise<Student> {
    const userCreatedStudentId = studentIds.find(idx => idx === id);
    if (!userCreatedStudentId) throw new NotFoundException('Student Not Found');
    return this.findOne({ id: userCreatedStudentId });
  }

  async createStudent(
    name: string,
    status: StudentLevel,
    userId: string,
  ): Promise<Student> {
    const student = this.create({
      id: uuid(),
      name,
      status,
      userId,
    });

    return this.save(student);
  }

  async updateStudentLevelStatus(
    id: string,
    status: StudentLevel,
    studentIds: string[],
  ): Promise<Student> {
    const userCreatedStudentId = studentIds.find(idx => idx === id);
    if (!userCreatedStudentId) throw new NotFoundException('Student Not Found');

    const student = await this.findOne({ id: userCreatedStudentId });
    student.status = status;

    return this.save(student);
  }

  async deleteStudent(
    id: string,
    studentIds: string[],
  ): Promise<{ id: string }> {
    const userCreatedStudentId = studentIds.find(idx => idx === id);
    if (!userCreatedStudentId) throw new NotFoundException('Student Not Found');

    const student = await this.findOne({ id: userCreatedStudentId });
    const data = await this.delete({ id: userCreatedStudentId });
    if (!data) throw new NotFoundException('Data Not Found');

    return { id: student.id };
  }
}
