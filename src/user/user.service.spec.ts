import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserRequestDTO } from "./user.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";

describe("UserService", () => {
  let service: UserService;
  let prisma: PrismaService;
  let prismaMock: {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create an user with valid data", async () => {
    const userDto: UserRequestDTO = new UserRequestDTO();
    userDto.email = "subrata@test.com";
    userDto.name = "Subrata";

    const mockUser: User = {
      id: 1,
      name: "Subrata",
      email: "subrata@test.com",
      password: "password",
    };

    prismaMock.user.create.mockResolvedValue(mockUser);

    const result = await service.createUser(userDto);

    expect(result).toEqual(mockUser);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: { email: userDto.email, name: userDto.name },
    });
  });

  it("should find an user with given id", async () => {
    const mockUser: User = {
      id: 1,
      name: "Subrata",
      email: "subrata@test.com",
      password: "password",
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

  it("should throw an error when no user if found", async () => {
    const id = 123;
    const spy = jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
    await expect(service.getUserById(id)).rejects.toThrow(NotFoundException);

    expect(spy).toHaveBeenCalledWith({
      where: { id: id },
    });
  });

  it("should update user with valid data", async () => {
    const userDto = new UserRequestDTO();
    userDto.name = "Subrata";
    userDto.email = "subrata2@test.com";
    userDto.id = 1;

    const mockUser: User = {
      id: 1,
      name: "Subrata",
      email: "subrata2@test.com",
      password: "password",
    };

    prismaMock.user.update.mockResolvedValue(mockUser);

    const result = await service.update(1, userDto);

    expect(result).toEqual(mockUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        name: "Subrata",
        email: "subrata2@test.com",
      },
    });
  });

  it("should delete user with valid id", async () => {
    const mockUser: User = {
      id: 1,
      name: "Subrata",
      email: "subrata@test.com",
      password: "password",
    };

    prismaMock.user.delete.mockResolvedValue(mockUser);

    await service.deleteById(1);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
});
