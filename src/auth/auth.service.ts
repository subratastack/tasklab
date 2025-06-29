import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginRequestDTO, LoginResponseDTO } from "./login.dto";
import { plainToInstance } from "class-transformer";
import { Prisma } from "@prisma/client";
import { SignUpRequestDTO, SignUpResponseDTO } from "./signup.dto";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(
    loginDto: LoginRequestDTO,
  ): Promise<LoginResponseDTO | void> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: loginDto.email,
        },
      });

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isValid = await argon2.verify(user.password, loginDto.password);

        if (!isValid) {
          throw new ForbiddenException("Unauthorised user");
        }

        const payload = { sub: user.id };
        const token = await this.generateJwtTokenAsync(payload);

        return plainToInstance(
          LoginResponseDTO,
          {
            accessToken: token,
          },
          {
            excludeExtraneousValues: true,
          },
        );
      } else {
        throw new ForbiddenException("Unauthorised user");
      }
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new ForbiddenException("Unauthorized user");
      }

      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException("Unexpected Error");
    }
  }

  public async signUp(
    signUpDto: SignUpRequestDTO,
  ): Promise<SignUpResponseDTO | void> {
    try {
      const hashedPassword: string = await argon2.hash(signUpDto.password);
      const user = await this.prisma.user.create({
        data: {
          ...signUpDto,
          password: hashedPassword,
        },
      });

      if (user) {
        const token = await this.jwtService.signAsync({ sub: user.id });
        return plainToInstance(
          SignUpResponseDTO,
          {
            accessToken: token,
          },
          {
            excludeExtraneousValues: true,
          },
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private generateJwtTokenAsync = (payload: any): Promise<string> => {
    return this.jwtService.signAsync(payload as string);
  };
}
