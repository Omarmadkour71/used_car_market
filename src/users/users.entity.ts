import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReportEntity } from 'src/reports/reports.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => ReportEntity, (report) => report.user)
  reports: ReportEntity[];
}
