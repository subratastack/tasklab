import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from './user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    public async createUser(userDto: UserDTO): Promise<UserDTO> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const result: User = await this.prisma.user.create({
            data: {
                name: userDto.name,
                email: userDto.email,
            },
        });

        return plainToInstance(UserDTO, result);
    }

    public async getUserById(id: number): Promise<UserDTO> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-redundant-type-constituents
        const result: User | null = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!result) {
            throw new NotFoundException('User not found');
        }

        return plainToInstance(UserDTO, result);
    }
}
