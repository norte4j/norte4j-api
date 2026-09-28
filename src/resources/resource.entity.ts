import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('content_resources')
@Index(['resource', 'slug'])
@Index(['resource', 'createdAt'])
export class ContentResource {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({length: 40}) resource: string;
  @Column({nullable: true, length: 190}) slug?: string;
  @Column({type: 'json'}) data: Record<string, unknown>;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
