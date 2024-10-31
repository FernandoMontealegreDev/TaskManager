import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * AppModule is the root module of the application.
 * It imports necessary modules and configures the application.
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available globally
    }),
    // Database connection configuration
    TypeOrmModule.forRoot({
      type: 'mysql', // Database type
      host: process.env.DB_HOST, // Database host
      port: parseInt(process.env.DB_PORT), // Database port
      username: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      database: process.env.DB_NAME, // Database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to entities
      synchronize: process.env.NODE_ENV !== 'production', // Enable auto-sync in development
    }),
    AuthModule, // Authentication module
    TasksModule, // Task management module
  ],
  controllers: [AppController], // Controllers to handle incoming requests
  providers: [AppService], // Service providers for the application
})
export class AppModule {}
