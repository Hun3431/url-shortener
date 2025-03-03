// src/url/url.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Redirect,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UrlService } from './url.service';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UrlEntity } from 'src/entity/url/url.entity';
import { CreateUrlDto } from 'src/dto/url/create.dto';

@ApiTags('URL Shortener')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'URL 단축 생성',
    description:
      'URL을 단축된 URL로 생성합니다. shortUrl을 직접 입력하여 생성할 수 있습니다.',
  })
  @ApiCreatedResponse({ description: '단축된 URL 정보', type: UrlEntity })
  async createShortUrl(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<{ shortUrl: string }> {
    if (!createUrlDto.url) {
      throw new BadRequestException('URL을 입력해주세요.');
    }
    if (
      createUrlDto.customShortUrl &&
      !/^[a-zA-Z0-9]+$/.test(createUrlDto.customShortUrl)
    ) {
      throw new BadRequestException(
        'customShortUrl은 영문, 숫자만 가능합니다.',
      );
    }
    // 수정: createUrlDto 전체를 service에 전달
    return this.urlService.createShortUrl(createUrlDto);
  }

  @Get(':shortUrl')
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

  @Get('exists')
  @ApiOperation({
    summary: 'URL 존재 여부 확인',
    description:
      '기존 URL과 동일한 URL이 있는지 확인하고, 있다면 단축 URL을 반환합니다.',
  })
  @ApiQuery({ name: 'url', description: '확인할 URL' })
  @ApiOkResponse({
    description: 'URL 존재 여부 및 단축 URL 정보',
    type: Object,
  })
  async checkExistingUrl(
    @Query('url') originalUrl: string,
  ): Promise<{ exists: boolean; shortUrl?: string }> {
    if (!originalUrl) {
      throw new BadRequestException('URL을 입력해주세요.');
    }
    return this.urlService.checkExistingUrl(originalUrl);
  }

  @Get()
  @ApiOperation({
    summary: 'URL 전체 목록 조회 (개발용)',
    description: '저장된 모든 URL 목록을 조회합니다. (개발 및 테스트용)',
  })
  @ApiOkResponse({ description: 'URL 목록 조회 성공', type: [UrlEntity] })
  async getAllUrls(): Promise<UrlEntity[]> {
    return this.urlService.getAllUrls();
  }
}
