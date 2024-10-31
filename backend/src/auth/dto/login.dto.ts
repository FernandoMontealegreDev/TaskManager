import { IsEmail, IsString } from 'class-validator';

/**
 * LoginDto is a Data Transfer Object used for user login.
 * It validates the input data to ensure proper format and type.
 */
export class LoginDto {
  /**
   * User's email address. Must be in a valid email format.
   */
  @IsEmail()
  email: string;

  /**
   * User's password. Must be a string.
   */
  @IsString()
  password: string;
}
