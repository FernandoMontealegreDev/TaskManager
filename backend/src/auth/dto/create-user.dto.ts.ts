import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * RegisterDto is a Data Transfer Object used for user registration.
 * It validates the input data to ensure proper format and type.
 */
export class RegisterDto {
  /**
   * User's email address. Must be in a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * User's password. Must be a string and at least 8 characters long.
   */
  @IsString()
  @MinLength(8)
  password: string;

  /**
   * User's name. Must be a string.
   */
  @IsString()
  name: string;
}
