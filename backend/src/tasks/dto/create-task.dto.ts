import { IsString, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

/**
 * CreateTaskDto is a Data Transfer Object used for creating a new task.
 * It validates the input data to ensure proper format and type.
 */
export class CreateTaskDto {
  /**
   * The title of the task. Must be a string.
   */
  @IsString()
  title: string;

  /**
   * A detailed description of the task. Must be a string.
   */
  @IsString()
  description: string;

  /**
   * The current status of the task. Must be one of the predefined TaskStatus values.
   */
  @IsEnum(TaskStatus)
  status: TaskStatus;

  /**
   * The due date for the task. Must be a valid date string in ISO 8601 format.
   */
  @IsDateString()
  dueDate: string;
}
