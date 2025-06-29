import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDTO } from "./login.dto";
import { SignUpRequestDTO } from "./signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() loginRequestDto: LoginRequestDTO) {
    return this.authService.login(loginRequestDto);
  }

  @Post("signup")
  @HttpCode(201)
  signUp(@Body() signUpDTO: SignUpRequestDTO) {
    return this.authService.signUp(signUpDTO);
  }
}
