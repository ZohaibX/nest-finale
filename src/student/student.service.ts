import { Injectable } from '@nestjs/common';
import { StudentRepo } from './student.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentLevel } from './enum/student.level';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentRepo)
    private studentRepo: StudentRepo,
  ) {}

  async getStudents(studentIds: string[]): Promise<Student[]> {
    return this.studentRepo.getStudents(studentIds);
  }

  async getStudent(id: string, studentIds: string[]): Promise<Student> {
    return this.studentRepo.getStudent(id, studentIds);
  }

  async createStudent(
    name: string,
    status: StudentLevel,
    userId: string,
  ): Promise<Student> {
    return this.studentRepo.createStudent(name, status, userId);
  }

  async updateStudentLevelStatus(
    id: string,
    status: StudentLevel,
    studentIds: string[],
  ): Promise<Student> {
    return this.studentRepo.updateStudentLevelStatus(id, status, studentIds);
  }

  async deleteStudent(
    id: string,
    studentIds: string[],
  ): Promise<{ id: string }> {
    return this.studentRepo.deleteStudent(id, studentIds);
  }
}
