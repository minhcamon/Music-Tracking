import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SyncMode } from '@prisma/client';

export class SyncTriggerDto {
  @IsUUID()
  connectionId!: string;

  @IsOptional()
  @IsEnum(SyncMode)
  mode?: SyncMode = SyncMode.MANUAL;
}
