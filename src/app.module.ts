import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from './entity/url/url.entity';
import { UrlModule } from './url/url.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      entities: [UrlEntity],
      synchronize: true,
      logging: true,
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule],
})
export class AppModule {}
