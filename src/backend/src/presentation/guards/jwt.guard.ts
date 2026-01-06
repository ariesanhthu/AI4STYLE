import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '@/presentation/guards/decorators';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private currentContext: ExecutionContext | null = null;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const handler = context.getHandler();
    const className = context.getClass().name;
    const route = `${className}.${handler.name || 'unknown'}`;

    if (isPublic) {
      console.log(`[JwtGuard] Public endpoint detected: ${route}, skipping authentication`);
      // For public endpoints, skip authentication completely
      // Don't call super.canActivate() to avoid Passport JWT strategy validation
      // But store context in case handleRequest is called anyway
      this.currentContext = context;
      return true;
    }

    console.log(`[JwtGuard] Protected endpoint: ${route}, requiring authentication`);
    this.currentContext = context; // Store context for handleRequest
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Safety check: if current context is public, don't validate
    if (this.currentContext) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
        this.currentContext.getHandler(),
        this.currentContext.getClass(),
      ]);
      if (isPublic) {
        // For public endpoints, return null user (no authentication required)
        // Don't throw error even if token is missing/invalid
        console.log(`[JwtGuard] handleRequest called for public endpoint, returning null`);
        this.currentContext = null; // Clear context after use
        return null;
      }
    }

    // For protected endpoints, validate token
    // Note: handleRequest is only called when canActivate calls super.canActivate()
    // For public endpoints, canActivate returns true directly, so handleRequest should not be called
    // But if it is called somehow, we check currentContext above
    this.currentContext = null; // Clear context after use
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
