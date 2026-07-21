import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWNERSHIP_SCOPE_KEY } from '../decorators/ownership-scope.decorator';

@Injectable()
export class OwnershipScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ownershipConfig = this.reflector.getAllAndOverride<{ paramName: string; userIdField?: string }>(
      OWNERSHIP_SCOPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!ownershipConfig) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const resourceUserId = request.params[ownershipConfig.paramName] || request.body[ownershipConfig.paramName];
    const userId = user.sub;
    if (resourceUserId && resourceUserId !== userId) {
      if (!user.roles?.includes('admin')) {
        throw new ForbiddenException('You can only access your own resources');
      }
    }
    return true;
  }
}
