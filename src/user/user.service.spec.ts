import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDTO } from './user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let service: UserService;
    let prisma: PrismaService;
    let prismaMock: {
        user: {
            create: jest.Mock;
            findUnique: jest.Mock;
        };
    };

    beforeEach(async () => {
        prismaMock = {
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
            },
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an user with valid data', async () => {
        const userDto: UserDTO = new UserDTO();
        userDto.email = 'subrata@test.com';
        userDto.name = 'Subrata';

        const mockUser: UserDTO = {
            id: 1,
            name: 'Subrata',
            email: 'subrata@test.com',
        };

        prismaMock.user.create.mockResolvedValue(mockUser);

        const result = await service.createUser(userDto);

        expect(result).toEqual(mockUser);
        expect(prismaMock.user.create).toHaveBeenCalledWith({
            data: { email: userDto.email, name: userDto.name },
        });
    });

    it('should find an user with given id', async () => {
        const mockUser: UserDTO = {
            id: 1,
            name: 'Subrata',
            email: 'subrata@test.com',
        };

        prismaMock.user.findUnique.mockResolvedValue(mockUser);

        const result = await service.getUserById(1);

        expect(result).toEqual(mockUser);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        });
    });

    it('should throw an error when no user if found', async () => {
        const id = 123;
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
        await expect(service.getUserById(id)).rejects.toThrow(
            NotFoundException,
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: id },
        });
    });
});
