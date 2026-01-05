import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '닉네임', required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({ description: '독서 기록 공개 여부', required: false })
  @IsBoolean()
  @IsOptional()
  isReadingLogPublic?: boolean;
}
