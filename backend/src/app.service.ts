import { Injectable } from '@nestjs/common';

/**
 * AppService provides application-level services.
 * In this case, it provides a greeting message.
 */
@Injectable()
export class AppService {
  /**
   * Returns a greeting message and the current timestamp.
   * @returns An object containing a welcome message and the current timestamp.
   */
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Welcome to the Task Manager API!', // Greeting message
      timestamp: new Date().toISOString(), // Current timestamp in ISO format
    };
  }
}
