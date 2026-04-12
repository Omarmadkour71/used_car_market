import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  lat: number;
  @Expose()
  lun: number;
  @Expose()
  year: number;
  @Expose()
  price: number;
  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
