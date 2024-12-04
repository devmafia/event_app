import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import { Models } from './models/models';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as env from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from "./user/user.module"
import { EventsModule } from './event/events.module';
import { BookingModule } from './booking/booking.module';
env.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: `postgres`,
      password: `tiger7W!`,
      database: `htdocs`,
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature(Object.values(Models)),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      autoSchemaFile: './schema.gql',
    }),
    AuthModule, UserModule, EventsModule, BookingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
