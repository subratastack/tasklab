import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { ProjectDTO } from "./project.dto";
import { GetUser } from "src/decorators/get-user.decorator";

@UseGuards(JwtAuthGuard)
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(201)
  create(@Body() projectDto: ProjectDTO, @GetUser("id") userId: number) {
    return this.projectService.create(projectDto, userId);
  }

  @Get(':id')
  @HttpCode(200)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findById(id);
  }
}
