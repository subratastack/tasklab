import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserRequestDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserResponseDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
