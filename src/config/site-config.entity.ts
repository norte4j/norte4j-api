import {Column, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';

@Entity('site_config')
export class SiteConfig {
  @PrimaryColumn({length: 100}) key: string;
  @Column({type: 'text'}) value: string;
  @UpdateDateColumn() updatedAt: Date;
}
