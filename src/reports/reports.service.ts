import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { UserEntity } from 'src/users/users.entity';
import { EstimateReportDto } from './dtos/estimate-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity) private repo: Repository<ReportEntity>,
  ) {}

  create(report: CreateReportDto, user: UserEntity) {
    const newReport = this.repo.create(report);
    newReport.user = user;
    return this.repo.save(newReport);
  }

  async changeApproval(id: string, approval: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('Report Not found');
    }

    report.approved = approval;
    return this.repo.save(report);
  }

  createEstimate({ make, model, lun, lat, year, mileage }: EstimateReportDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lun - :lun BETWEEN -5 AND +5', { lun })
      .andWhere('lat - :lat BETWEEN -5 AND +5', { lat })
      .andWhere('year - :year BETWEEN -3 AND +3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'ASC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
