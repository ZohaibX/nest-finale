import { Injectable } from '@nestjs/common';
import { StudentRepo } from './student.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentLevel } from './enum/student.level';
import { AssignTasksToStudentInput } from './inputs/assign.input';
import { StudentInput } from './inputs/student.input';

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
    studentInput: StudentInput,
    status: StudentLevel,
    userId: string,
  ): Promise<Student> {
    return this.studentRepo.createStudent(studentInput, status, userId);
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

  // jitne b student ids dain ghai, un ka data mile gha
  async getManyStudents(studentIds: string[]) {
    console.log(studentIds);
    return this.studentRepo.find({
      where: {
        id: {
          $in: studentIds,
        },
      },
    });
  }

  async assignTasksToStudent(assignInput: AssignTasksToStudentInput) {
    const student = await this.studentRepo.findOne({
      id: assignInput.studentId,
    });
    console.log(student);
    student.tasks = [...student.tasks, ...assignInput.taskIds];
    return this.studentRepo.save(student);
  }
}
