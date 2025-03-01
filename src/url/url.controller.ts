import { Controller, Logger, Post } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createUrl() {
    return await this.urlService.createUrl();
  }
}
