import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../default.entity';

@Entity()
export class UrlEntity extends DefaultEntity {
  @Column()
  url: string;

  @Column()
  shortUrl: string;

  @Column()
  created: Date;

  @Column()
  updated: Date;

  @Column()
  status: boolean;
}
