import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SignUpRequestDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SignUpResponseDTO {
  @Expose()
  accessToken: string;
}
