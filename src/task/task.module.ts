import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepo } from './task.repository';
import { TaskResolver } from './task.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepo])],
  providers: [TaskService, TaskResolver],
  exports: [TaskService],
})
export class TaskModule {}
