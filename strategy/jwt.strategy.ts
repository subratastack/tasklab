import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret)
      throw new InternalServerErrorException("JWT_SECRET not defined");
    const jwtFromRequest = (
      ExtractJwt as unknown as {
        fromAuthHeaderAsBearerToken(): (req: Request) => string | null;
      }
    ).fromAuthHeaderAsBearerToken();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { sub: number }) {
    return {
      id: payload.sub,
    };
  }
}
