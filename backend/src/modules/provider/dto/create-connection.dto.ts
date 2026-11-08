import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MusicProvider } from '@prisma/client';

export class CreateConnectionDto {
  @IsEnum(MusicProvider)
  provider!: MusicProvider;

  @IsString()
  @IsNotEmpty()
  providerUserId!: string;

  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
