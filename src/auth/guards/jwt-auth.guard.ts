import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
        private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers['authorization'].split(' ')[1];
        console.log('=> authorizationHeader:', accessToken);

        try {
            this.authService.validToken(accessToken);
            return true;
        } catch (error) {
            console.log('error:', error);
            return false;
        }
        // const roles: string[] = this._reflector.get<string[]>(
        //   'roles',
        //   context.getHandler(),
        // );

        // if (!roles) return true;

        // const request = context.switchToHttp().getRequest();

        // const { user } = request;
        // const hasRole = () =>
        //   user.roles.some((role: string) => roles.includes(role));

        // return user && user.roles && hasRole();
    }
}
