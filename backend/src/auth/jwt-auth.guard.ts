import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override canActivate to add custom validation logic
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Call the base AuthGuard's canActivate method
      const result = await super.canActivate(context);

      if (!result) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return result as boolean;
    } catch (error) {
      throw new UnauthorizedException('Authentication error: ' + error.message);
    }
  }

  /**
   * Enhanced method to handle authentication request
   */
  handleRequest<TUser = User>(err: any, user: TUser, info: any): TUser {
    // Handle specific token errors
    if (info instanceof Error) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
    }

    // Handle general error or user not found
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized user');
    }

    // Additional user validation if needed
    if (user && typeof user === 'object' && 'isActive' in user) {
      if (!(user as any).isActive) {
        throw new UnauthorizedException('Inactive user');
      }
    }

    return user;
  }
}
