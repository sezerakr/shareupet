import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { UserPermissions } from 'src/core/enums/userpermissions.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const requiredPermissions = this.reflector.getAllAndOverride<UserPermissions[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles && !requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const userRoles: Role[] = user.roles || [];
        const userPermissions: UserPermissions[] = user.permissions || [];

        let hasRequiredRoles = true;
        if (requiredRoles) {
            hasRequiredRoles = requiredRoles.some((role) => userRoles.includes(role));
        }

        let hasRequiredPermissions = true;
        if (requiredPermissions) {
            hasRequiredPermissions = requiredPermissions.some((permission) =>
                userPermissions.includes(permission),
            );
        }

        return hasRequiredRoles && hasRequiredPermissions;
    }
}