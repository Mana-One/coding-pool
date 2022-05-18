import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly appConfig: AppConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig.JWT_SECRET,
            algorithms: ["HS256"]
        });
    }

  async validate(payload: any) {
        return { 
            accountId: payload.sub, 
            username: payload.username, 
            wallet: payload.wallet,
            role: payload.role
        };
    }
}
