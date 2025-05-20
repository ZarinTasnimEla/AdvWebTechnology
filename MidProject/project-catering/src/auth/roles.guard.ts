// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRole: 'admin' | 'customer') {}

  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    
    if (!user || user.role !== this.requiredRole) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }
}