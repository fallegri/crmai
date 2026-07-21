import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthUseCase } from '../../application/use-cases';
import { JwtAuthGuard } from '../guards';
import { CurrentUser } from '../decorators';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authUseCase.register(dto);
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authUseCase.login(dto.email, dto.password, ipAddress, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authUseCase.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke session' })
  async logout(@CurrentUser('sub') userId: string, @Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await this.authUseCase.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser('sub') userId: string) {
    const user = await this.authUseCase.getProfile(userId);
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, status: user.status };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authUseCase.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authUseCase.resetPassword(dto.token, dto.password);
    return { message: 'Password reset successfully' };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable two-factor authentication' })
  async enable2FA(@CurrentUser('sub') userId: string) {
    return this.authUseCase.enable2FA(userId);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable two-factor authentication' })
  async disable2FA(@CurrentUser('sub') userId: string) {
    await this.authUseCase.disable2FA(userId);
    return { message: '2FA disabled' };
  }
}
