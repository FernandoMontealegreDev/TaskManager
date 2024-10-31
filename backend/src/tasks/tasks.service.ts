import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException, // Importa esta excepción para conflictos
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  /**
   * Creates a new task.
   * @param createTaskDto - Data transfer object containing task details.
   * @param user - The user creating the task.
   * @returns The created task without the user details.
   * @throws ConflictException if a task with the same title already exists for the user.
   */
  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Omit<Task, 'user'> & { id: number }> {
    // Verifica si la tarea ya existe
    const existingTask = await this.tasksRepository.findOne({
      where: { title: createTaskDto.title, userId: user.id },
    });

    if (existingTask) {
      throw new ConflictException(
        `Task with title "${createTaskDto.title}" already exists`,
      );
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      user,
      userId: user.id,
    });

    await this.tasksRepository.save(task);

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      userId: task.userId,
    };
  }

  /**
   * Retrieves tasks for a specific user, optionally filtered by status.
   * @param user - The user whose tasks to retrieve.
   * @param status - Optional task status filter.
   * @returns An array of tasks.
   */
  async getTasks(user: User, status?: TaskStatus): Promise<Task[]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId: user.id })
      .orderBy('task.dueDate', 'ASC');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    return await query.getMany();
  }

  /**
   * Retrieves a task by ID for a specific user.
   * @param id - The ID of the task to retrieve.
   * @param user - The user who owns the task.
   * @returns The task if found.
   * @throws NotFoundException if the task is not found.
   */
  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Updates an existing task.
   * @param id - The ID of the task to update.
   * @param updateTaskDto - Data transfer object containing updated task details.
   * @param user - The user updating the task.
   * @returns The updated task.
   * @throws NotFoundException if the task is not found.
   * @throws ForbiddenException if the user does not own the task.
   */
  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (task.userId !== user.id) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  /**
   * Deletes a task.
   * @param id - The ID of the task to delete.
   * @param user - The user deleting the task.
   * @returns Void.
   * @throws NotFoundException if the task is not found.
   * @throws ForbiddenException if the user does not own the task.
   */
  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);

    if (task.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.tasksRepository.remove(task);
  }
}
