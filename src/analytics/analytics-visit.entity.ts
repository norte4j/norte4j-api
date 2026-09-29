import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('analytics_daily_visits')
@Unique('uq_analytics_daily_visitor', ['visitorHash', 'visitDate'])
@Index('idx_analytics_daily_visits_created_at', ['createdAt'])
export class AnalyticsDailyVisit {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({name: 'visitor_hash', type: 'char', length: 64}) visitorHash: string;
  @Column({name: 'visit_date', type: 'date'}) visitDate: string;
  @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
