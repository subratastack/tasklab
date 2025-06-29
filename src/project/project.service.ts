import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProjectDTO } from "./project.dto";
import { plainToInstance } from "class-transformer";
import { Prisma, Project } from "@prisma/client";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    projectDto: ProjectDTO,
    userId: number,
  ): Promise<ProjectDTO | void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const project: Project = await this.prisma.project.create({
        data: {
          name: projectDto.name,
          ownerId: userId,
        },
      });

      if (project) {
        return plainToInstance(ProjectDTO, project);
      }
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  public async findById(id: number): Promise<ProjectDTO | void> {
    try {
      const project = await this.prisma.project.findUniqueOrThrow({
        where: {
          id
        }
      });

      return plainToInstance(
        ProjectDTO,
        project,
        {
          excludeExtraneousValues: true
        }
      )
    } catch(error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Could not find project"); 
      }

      if (error as Error) {
        throw new InternalServerErrorException((error as Error).message);
      }
    }
  }
}
