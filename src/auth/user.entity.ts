import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({length: 120}) name: string;
  @Column({unique: true, length: 190}) email: string;
  @Column({select: false}) passwordHash: string;
  @Column({default: 'admin'}) role: 'admin';
  @Column({default: true}) active: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
