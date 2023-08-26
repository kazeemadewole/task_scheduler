import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { payloadDto } from '../dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private log: Logger = new Logger('inside jwt');
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('AT_SECRET'),
    });
  }
  async validate(payload: payloadDto) {
    const user = await this.userService.getUser(payload.user.id);
    if (!user) {
      throw new HttpException('UnAuthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!user.emailVerified) {
      throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
