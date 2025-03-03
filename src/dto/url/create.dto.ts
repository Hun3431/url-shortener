import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ description: '원래 URL', example: 'https://www.example.com' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000) // URL 최대 길이 제한 (필요에 따라 조정)
  url: string;

  @ApiProperty({
    description: '직접 입력할 단축 URL (선택)',
    example: 'customShort',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50) // shortUrl 최대 길이 제한 (필요에 따라 조정)
  customShortUrl?: string;
}
