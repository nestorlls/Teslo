import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] =
      this.reflector.get<string[]>(META_ROLES, context.getHandler()) || [];
    if (!roles.length) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new BadRequestException('User not found');

    for (const role of roles) {
      if (user.roles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} doesn't have required roles: [${roles}]`,
    );
  }
}
