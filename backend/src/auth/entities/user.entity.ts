import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

/**
 * User entity representing the user in the system.
 * It holds user-related information and their associated tasks.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Consider adding a transformation to not expose this field directly.

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  /**
   * Transforms the user object to exclude sensitive information.
   * @returns A plain object with user details excluding the password.
   */
  toResponseObject() {
    const { id, email, name } = this;
    return { id, email, name };
  }
}
