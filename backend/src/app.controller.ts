import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * AppController is responsible for handling requests to the root endpoint.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root endpoint.
   * @returns An object containing a greeting message and a timestamp.
   */
  @Get()
  getHello(): { message: string; timestamp: string } {
    return this.appService.getHello();
  }
}
