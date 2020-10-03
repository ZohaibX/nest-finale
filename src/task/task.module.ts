import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepo } from './task.repository';
import { TaskResolver } from './task.resolver';
import { TaskType } from './task.type';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepo]), AuthModule],
  providers: [TaskService, TaskResolver],
  exports: [TaskService],
})
export class TaskModule {}
