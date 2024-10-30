import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { GoogleProfileDto } from '../dto/google-profile.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: Logger = new Logger('[Google Strategy]');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL')}/auth/v1/login/oauth2/google/redirect`,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    this.logger.verbose(
      'OAuth2 login request has been passed to the controller.',
    );

    // extract google account's information
    const { name, emails, photos } = profile;
    this.logger.verbose(`name: ${name}`);
    this.logger.verbose(`emails: ${emails}`);
    this.logger.verbose(`photos: ${photos}`);

    // define google profile DTO
    const googleProfileDto: GoogleProfileDto = plainToInstance(
      GoogleProfileDto,
      {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
      },
    );

    // find or create the google member
    const member = this.authService.findOrCreateGoogleMember(googleProfileDto);
    done(null, member);
  }
}
