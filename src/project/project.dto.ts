import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProjectDTO {
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  ownerId: number;
  
  @IsOptional()
  createdOn?: string;
}
