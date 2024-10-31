import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { TaskStatus } from './entities/task.entity';

/**
 * Controller for handling tasks.
 * It includes endpoints for creating, retrieving, updating, and deleting tasks.
 */
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * Create a new task.
   * @param createTaskDto - Data for the new task.
   * @param user - The user creating the task.
   * @returns The created task.
   */
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  /**
   * Get all tasks for the authenticated user.
   * Optionally filter by status.
   * @param user - The authenticated user.
   * @param status - Optional status to filter tasks by.
   * @returns A list of tasks.
   */
  @Get()
  getTasks(@GetUser() user: User, @Query('status') status?: TaskStatus) {
    return this.tasksService.getTasks(user, status);
  }

  /**
   * Get a specific task by ID.
   * @param id - The ID of the task to retrieve.
   * @param user - The authenticated user.
   * @returns The requested task.
   */
  @Get(':id')
  getTaskById(@Param('id') id: number, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  /**
   * Update a specific task by ID.
   * @param id - The ID of the task to update.
   * @param updateTaskDto - The updated task data.
   * @param user - The authenticated user.
   * @returns The updated task.
   */
  @Put(':id')
  updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  /**
   * Delete a specific task by ID.
   * @param id - The ID of the task to delete.
   * @param user - The authenticated user.
   * @returns A confirmation message or the deleted task.
   */
  @Delete(':id')
  deleteTask(@Param('id') id: number, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user);
  }
}
