import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable, tap } from 'rxjs';
import { UserDto } from '../dto';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const jwt: string | undefined = context.switchToHttp().getRequest().cookies
      ?.Authentication as string;

    if (!jwt) return false;

    return this.authClient
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
