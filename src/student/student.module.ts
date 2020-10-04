import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepo } from './student.repository';
import { StudentResolver } from './student.resolver';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentRepo]),
    forwardRef(() => AuthModule),
    forwardRef(() => TaskModule),
  ],
  providers: [StudentService, StudentResolver],
  exports: [StudentService],
})
export class StudentModule {}
