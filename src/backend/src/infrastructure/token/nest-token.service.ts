import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@/shared/interfaces';

@Injectable()
export class NestTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) { }

  sign(payload: object, options?: object): string {
    return this.jwtService.sign(payload, options);
  }

  verify<T extends object = any>(token: string, options?: object): T {
    return this.jwtService.verify<T>(token, options);
  }
}
