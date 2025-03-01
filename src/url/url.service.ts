import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entity/url/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async createUrl() {}
}
