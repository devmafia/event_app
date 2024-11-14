import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { UnauthorizedException } from '@nestjs/common';
import { LoginAdminDto, LoginDto, RegisterDto } from '../dtos/dtos.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async register(
    @Args('registerUser') registerDto: RegisterDto,
  ): Promise<string> {
    return this.authService.register(registerDto);
  }

  @Mutation(() => String)
  async login(
    @Args('loginUser') loginDto: LoginDto,
  ): Promise<{ token: string; userId: number }> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => String)
  async loginAdmin(
    @Args('loginAdmin') loginAdminDto: LoginAdminDto,
  ): Promise<string> {
    return this.authService.loginAdmin(loginAdminDto);
  }

  @Mutation(() => String)
  async logout(): Promise<string> {
    return 'Logged out successfully';
  }
}
