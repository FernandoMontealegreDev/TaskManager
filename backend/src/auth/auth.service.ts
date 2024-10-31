import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/create-user.dto.ts';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from './types/auth.types';

/**
 * Service handling authentication business logic including user registration and login.
 *
 * @class AuthService
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user in the system.
   *
   * @param {RegisterDto} registerDto - Registration data
   * @returns {Promise<AuthResponse>} Authentication response
   * @throws {ConflictException} When user already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const { email, password, name } = registerDto;

      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      const savedUser = await this.usersRepository.save(user);

      const payload = {
        id: savedUser.id,
        email: savedUser.email,
      };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h',
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = savedUser;

      return { token, user: userWithoutPassword };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {LoginDto} loginDto - Login credentials
   * @returns {Promise<AuthResponse>} Authentication response
   * @throws {UnauthorizedException} When credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const { email, password } = loginDto;

      const user = await this.usersRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'name'],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h',
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }
}
