import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

/**
 * Enum for representing the status of a task.
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Entity representing a task in the application.
 */
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The title of the task.
   */
  @Column()
  title: string;

  /**
   * A detailed description of the task.
   */
  @Column()
  description: string;

  /**
   * The current status of the task. It can be one of the following:
   * - 'pending'
   * - 'in_progress'
   * - 'completed'
   * Defaults to 'pending'.
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  /**
   * The due date for the task.
   */
  @Column()
  dueDate: Date;

  /**
   * The user who created the task. This is a many-to-one relationship.
   */
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  /**
   * The ID of the user who created the task.
   */
  @Column()
  userId: number;
}
