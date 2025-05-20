// food-item/dto/upload-files.dto.ts
import { IsOptional } from 'class-validator';

export class UploadFilesDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  price?: number;
}