import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRequestDTO, UserResponseDTO } from "./user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  public async createUser(userDto: UserRequestDTO): Promise<UserResponseDTO> {
    const result: User = await this.prisma.user.create({
      data: {
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
      },
    });

    return plainToInstance(UserResponseDTO, result);
  }

  public async getUserById(id: number): Promise<UserResponseDTO> {
    const result: User | null = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException("User not found");
    }

    return plainToInstance(UserResponseDTO, result);
  }

  public async update(
    id: number,
    userDto: UserRequestDTO,
  ): Promise<UserResponseDTO> {
    const result: User = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: userDto.name,
        email: userDto.email,
      },
    });

    return plainToInstance(UserResponseDTO, result);
  }

  public async deleteById(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
