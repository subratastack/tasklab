import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
    id: number;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
