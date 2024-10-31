/**
 * Represents a user in the system.
 */
export interface User {
  id: number; // Unique identifier for the user
  email: string; // Email address of the user
  name: string; // Name of the user
}

/**
 * Represents the credentials needed for user login.
 */
export interface LoginCredentials {
  email: string; // Email address of the user for login
  password: string; // Password for the user
}

/**
 * Represents the credentials needed for user registration.
 * Extends LoginCredentials to include the user's name.
 */
export interface RegisterCredentials extends LoginCredentials {
  name: string; // Name of the user for registration
}
