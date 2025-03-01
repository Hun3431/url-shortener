import { PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: `PK`,
  })
  id: string;
}
