import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { AuthModule } from '../auth/auth.module';

/**
 * The TasksModule is responsible for managing tasks in the application.
 * It encapsulates all the functionality related to tasks, including
 * the controller and service layers, as well as the Task entity.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), // Import the TypeORM module for Task entity
    AuthModule, // Import the Auth module to handle authentication
  ],
  controllers: [TasksController], // The controller responsible for handling HTTP requests
  providers: [TasksService], // The service responsible for the business logic related to tasks
})
export class TasksModule {}
