import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * The bootstrap function initializes and starts the NestJS application.
 * Configures global pipes, CORS, and server port settings.
 */
async function bootstrap() {
  // Create an instance of the application using the AppModule
  const app = await NestFactory.create(AppModule);

  // Use global validation pipes to validate incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // Enable Cross-Origin Resource Sharing (CORS) for the application
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Change this according to your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow the use of cookies and authorization headers
    allowedHeaders: 'Content-Type, Authorization', // Allow Content-Type and Authorization headers
  });

  // Get the port from environment variables or use 3000 as a default
  const port = process.env.PORT || 3000;

  // Start the application and listen on the specified port
  await app.listen(port);

  // Log the URL after the server starts
  console.log(`Server is running at http://localhost:${port}`);
}

// Call the bootstrap function to start the application
bootstrap();
