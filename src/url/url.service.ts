// src/url/url.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from 'src/entity/url/url.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUrlDto } from 'src/dto/url/create.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
  ) {}

  async createShortUrl(
    createUrlDto: CreateUrlDto,
  ): Promise<{ shortUrl: string }> {
    const { url: originalUrl, customShortUrl } = createUrlDto;

    // URL 중복 확인
    const existingUrl = await this.urlRepository.findOne({
      where: { url: originalUrl },
    });
    if (existingUrl) {
      return { shortUrl: existingUrl.shortUrl };
    }

    let shortUrl: string; // shortUrl 타입을 string으로 명시

    if (customShortUrl) {
      // customShortUrl 중복 확인
      const existingShort = await this.urlRepository.findOne({
        where: { shortUrl: customShortUrl },
      });
      if (existingShort) {
        throw new BadRequestException('이미 사용중인 shortUrl 입니다.');
      }
      shortUrl = customShortUrl; // customShortUrl이 있을 경우 shortUrl에 할당
    } else {
      shortUrl = await this.generateShortUrl(); // customShortUrl이 없을 경우 자동 생성
    }

    const urlEntity = new UrlEntity();
    urlEntity.url = originalUrl;
    urlEntity.shortUrl = shortUrl;
    urlEntity.created = new Date();
    urlEntity.updated = new Date();
    urlEntity.status = true; // or default value

    await this.urlRepository.save(urlEntity);
    return { shortUrl: shortUrl };
  }

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const urlEntity = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!urlEntity) {
      return null;
    }
    return urlEntity.url;
  }

  async getAllUrls(): Promise<UrlEntity[]> {
    return await this.urlRepository.find();
  }

  async checkExistingUrl(
    originalUrl: string,
  ): Promise<{ exists: boolean; shortUrl?: string }> {
    const existingUrl = await this.urlRepository.findOne({
      where: { url: originalUrl },
    });
    if (existingUrl) {
      return { exists: true, shortUrl: existingUrl.shortUrl };
    }
    return { exists: false };
  }

  private async generateShortUrl(): Promise<string> {
    let shortUrl = '';
    let isUnique = false;

    while (!isUnique) {
      shortUrl = uuidv4().substring(0, 8); // UUID의 앞 8자리 사용 (임의, 변경 가능)
      const existingShortUrl = await this.urlRepository.findOne({
        where: { shortUrl },
      });
      if (!existingShortUrl) {
        isUnique = true;
      }
    }
    return shortUrl;
  }
}
