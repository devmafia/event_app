// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models } from './models/models';
import { FileUploadResolver } from './users/file-upload.resolver';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { BookingsModule } from './bookings/bookings.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as env from 'dotenv';
import { UploadScalar } from './users/file-upload.resolver';
env.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres', // or your chosen database dialect
      host: 'localhost',
      port: 5432,
      username: `postgres`,
      password: `tiger7W!`,
      database: `htdocs`,
      autoLoadModels: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    BookingsModule,
    EventModule,
    AuthModule,
    UsersModule,
    SequelizeModule.forFeature(Object.values(Models)),
  ],
  controllers: [AppController],
  providers: [AppService, FileUploadResolver, UploadScalar],
})
export class AppModule {}
