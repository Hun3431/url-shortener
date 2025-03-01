import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entity/url/url.entity';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [TypeOrmModule],
})
export class UrlModule {}
