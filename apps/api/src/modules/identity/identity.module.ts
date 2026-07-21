import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthUseCase, SessionManagementUseCase, RoleManagementUseCase, PermissionCheckUseCase } from './application/use-cases';
import { USER_REPOSITORY_PORT, SESSION_PORT, TOKEN_SERVICE_PORT, PASSWORD_HASHER_PORT } from './application/ports';
import { PrismaUserRepositoryAdapter, RedisSessionAdapter, JwtTokenServiceAdapter, BcryptPasswordHasherAdapter } from './infrastructure/adapters';
import { AuthController, SessionsController, RolesController } from './interface/controllers';
import { JwtAuthGuard, PermissionsGuard, OwnershipScopeGuard } from './interface/guards';
import { JwtStrategy } from './interface/strategies/jwt.strategy';

const REPOSITORY_PROVIDERS = [
  { provide: USER_REPOSITORY_PORT, useClass: PrismaUserRepositoryAdapter },
  { provide: SESSION_PORT, useClass: RedisSessionAdapter },
  { provide: TOKEN_SERVICE_PORT, useClass: JwtTokenServiceAdapter },
  { provide: PASSWORD_HASHER_PORT, useClass: BcryptPasswordHasherAdapter },
];

const USE_CASE_PROVIDERS = [
  AuthUseCase,
  SessionManagementUseCase,
  RoleManagementUseCase,
  PermissionCheckUseCase,
];

const GUARD_PROVIDERS = [
  JwtAuthGuard,
  PermissionsGuard,
  OwnershipScopeGuard,
];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController, SessionsController, RolesController],
  providers: [
    ...REPOSITORY_PROVIDERS,
    ...USE_CASE_PROVIDERS,
    ...GUARD_PROVIDERS,
    JwtStrategy,
  ],
  exports: [
    ...USE_CASE_PROVIDERS,
    ...GUARD_PROVIDERS,
    JwtStrategy,
    PassportModule,
  ],
})
export class IdentityModule {}
