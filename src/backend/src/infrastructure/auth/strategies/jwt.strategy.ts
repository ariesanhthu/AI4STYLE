import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '@/shared/interfaces';
import { type IUserRepository, USER_REPOSITORY } from '@/core/user/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Match your signing secret
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, email } = payload;
    // Optionally load the full user from the repository:
    const user = await this.userRepository.findById(sub, { includeRole: true });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user.toJSON();
  }
}
