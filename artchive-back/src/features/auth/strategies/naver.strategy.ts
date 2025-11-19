import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID') ?? '',
      clientSecret: configService.get('NAVER_CLIENT_SECRET') ?? '',
      callbackURL: configService.get('NAVER_CALLBACK_URL') ?? '',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { id, nickname, profile_image: profileImg } = profile._json;
    const provider = 'naver';
    const providerId = id;
    const username = nickname;

    try {
      const user = await this.authService.validateUser({
        provider,
        providerId,
        username,
        profileImg,
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
