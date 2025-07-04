import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
