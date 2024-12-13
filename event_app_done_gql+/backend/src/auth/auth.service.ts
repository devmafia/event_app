import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UsersEvents, Administrator } from '../models/models';
import { RegisterInput, LoginInput, AuthResponse } from '../dtos/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersEvents) private readonly userModel: typeof UsersEvents,
    @InjectModel(Administrator) private readonly adminModel: typeof Administrator,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { username, email, password } = input;
    const role = "user";
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({ username, email, password: hashedPassword, role });

    return { message: "User registered successfully", token: "", userId: null };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { username, email, password } = input;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user || !username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRY'),
        secret: this.configService.get<string>('JWT_SECRET'),
      }
    );
    return { message: "Login successful", token: token, userId: user.id };
  }

  async loginAdmin(input: LoginInput): Promise<AuthResponse> {
    const { username, email, password } = input;

    const admin = await this.adminModel.findOne({ where: { email } });
    if (!admin || !username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (password !== admin.password) {
      throw new UnauthorizedException('Invalid credentials');
    }


    const token = this.jwtService.sign(
      { id: admin.id, email: admin.email },
      {
        expiresIn: this.configService.get<string>('ADMIN_EXPIRY'),
        secret: this.configService.get<string>('ADMIN_SECRET_KEY'),
      }
    );

    return { message: "Login successful", token };
  }

  logout(): AuthResponse {
    return { message: 'Logged out successfully', token: '', userId: null };
  }
}
