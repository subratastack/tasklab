import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProjectDTO {
  @Expose()
  @IsOptional()
  id?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  ownerId: number;
  
  @Expose()
  @IsOptional()
  createdOn?: string;
}
