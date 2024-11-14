import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { UsersEvents, Administrator } from '../models/models';
import { RegisterDto, LoginDto, LoginAdminDto } from '../dtos/dtos.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersEvents) private userModel: typeof UsersEvents,
    @InjectModel(Administrator) private adminModel: typeof Administrator,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<string> {
    const { username, email, password } = registerDto
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({ username, email, password: hashedPassword });

    return 'User registered successfully';
  }

  async login(loginDto: LoginDto): Promise<{ token: string; userId: number }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { secret: process.env.USER_SECRET_KEY, expiresIn: process.env.USER_EXPIRY }
    );

    return { token, userId: user.id };
  }

  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<string> {
    const { email, password } = loginAdminDto;
    const admin = await this.adminModel.findOne({ where: { email } });
    if (!admin || password !== admin.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { id: admin.id, email: admin.email },
      { secret: process.env.ADMIN_SECRET_KEY, expiresIn: process.env.ADMIN_EXPIRY }
    );

    return token;
  }
}
