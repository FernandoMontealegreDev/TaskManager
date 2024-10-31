import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-user.dto.ts';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './types/auth.types';

/**
 * Controller responsible for handling authentication-related HTTP requests.
 * Provides endpoints for user registration and login operations.
 *
 * @class AuthController
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user registration requests.
   * Creates a new user account and returns authentication credentials.
   *
   * @param {RegisterDto} registerDto - DTO containing user registration information
   * @returns {Promise<AuthResponse>} Authentication response containing JWT token and user info
   *
   * @example
   * POST /auth/register
   * {
   *   "email": "user@example.com",
   *   "password": "securePassword123",
   *   "name": "John Doe"
   * }
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * Handles user login requests.
   * Authenticates user credentials and returns authentication token.
   *
   * @param {LoginDto} loginDto - DTO containing user login credentials
   * @returns {Promise<AuthResponse>} Authentication response containing JWT token and user info
   *
   * @example
   * POST /auth/login
   * {
   *   "email": "user@example.com",
   *   "password": "securePassword123"
   * }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }
}
