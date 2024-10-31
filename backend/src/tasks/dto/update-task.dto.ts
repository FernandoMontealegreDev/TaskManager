import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

/**
 * UpdateTaskDto is a Data Transfer Object used for updating an existing task.
 * It allows partial updates to the task fields.
 */
export class UpdateTaskDto {
  /**
   * The title of the task. Must be a string if provided.
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * A detailed description of the task. Must be a string if provided.
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * The current status of the task. Must be one of the predefined TaskStatus values if provided.
   */
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  /**
   * The due date for the task. Must be a valid date string in ISO 8601 format if provided.
   */
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
