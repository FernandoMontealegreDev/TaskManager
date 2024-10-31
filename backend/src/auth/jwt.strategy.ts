import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy for handling authentication using JSON Web Tokens.
 * This strategy validates incoming JWTs and retrieves the associated user.
 *
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @param {Repository<User>} usersRepository - TypeORM repository for User entity
   * @param {ConfigService} configService - NestJS Config service for environment variables
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the associated user.
   * This method is called by Passport after the JWT has been verified.
   *
   * @param {any} payload - Decoded JWT payload
   * @returns {Promise<User>} The authenticated user
   * @throws {UnauthorizedException} If user is not found or validation fails
   */
  async validate(payload: any) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
        select: ['id', 'email', 'name'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      delete user.password;
      return user;
    } catch {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
