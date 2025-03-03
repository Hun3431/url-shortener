import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly urlService: UrlService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':shortUrl') // '/url' 엔드포인트 제거
  @ApiOperation({
    summary: '단축 URL 리다이렉트',
    description: '단축 URL로 접속 시 원래 URL로 리다이렉트합니다.',
  })
  @ApiParam({ name: 'shortUrl', description: '단축 URL' })
  @ApiOkResponse({ description: '리다이렉트 성공' })
  @Redirect('', 302)
  async redirectUrl(
    @Param('shortUrl') shortUrl: string,
  ): Promise<{ url: string }> {
    const originalUrl = await this.urlService.getOriginalUrl(shortUrl);
    if (!originalUrl) {
      throw new NotFoundException('존재하지 않는 단축 URL입니다.');
    }
    return { url: originalUrl };
  }
}
