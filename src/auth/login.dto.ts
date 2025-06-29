import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  accessToken: string;
}
