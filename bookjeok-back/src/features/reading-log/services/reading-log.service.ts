import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingLog } from '../entities/reading-log.entity';
import { CreateReadingLogDto } from '../dto/create-reading-log.dto';
import { UpdateReadingLogDto } from '../dto/update-reading-log.dto';

@Injectable()
export class ReadingLogService {
  constructor(
    @InjectRepository(ReadingLog)
    private readonly readingLogRepository: Repository<ReadingLog>,
  ) {}

  /**
   * 새로운 독서 기록을 생성합니다.
   * @param userId 사용자 ID
   * @param createReadingLogDto 독서 기록 생성 DTO
   * @returns 생성된 독서 기록 엔티티
   */
  async create(userId: number, createReadingLogDto: CreateReadingLogDto) {
    const log = this.readingLogRepository.create({
      userId,
      ...createReadingLogDto,
    });
    return await this.readingLogRepository.save(log);
  }

  /**
   * 특정 연/월의 독서 기록 목록을 조회합니다.
   * @param userId 사용자 ID
   * @param year 조회할 연도 (YYYY)
   * @param month 조회할 월 (MM)
   * @returns 해당 월의 독서 기록 리스트
   */
  async findAllByMonth(userId: number, year: number, month: number) {
    // TypeORM과 Postgres의 date 타입을 사용하여 해당 연/월의 기록을 조회합니다.
    return await this.readingLogRepository
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .andWhere("TO_CHAR(log.date, 'YYYY-MM') = :monthStr", {
        monthStr: `${year}-${String(month).padStart(2, '0')}`,
      })
      .orderBy('log.date', 'ASC')
      .getMany();
  }

  /**
   * 독서 기록을 수정합니다.
   * @param userId 사용자 ID (본인 확인용)
   * @param id 독서 기록 ID
   * @param updateReadingLogDto 수정할 데이터 DTO
   * @returns 수정된 독서 기록 엔티티
   */
  async update(
    userId: number,
    id: string,
    updateReadingLogDto: UpdateReadingLogDto,
  ) {
    const log = await this.readingLogRepository.findOne({
      where: { id, userId },
    });
    if (!log) {
      throw new NotFoundException('Reading log not found');
    }

    // 변경 사항 적용
    if (updateReadingLogDto.memo !== undefined) {
      log.memo = updateReadingLogDto.memo;
    }

    return await this.readingLogRepository.save(log);
  }

  /**
   * 독서 기록을 삭제합니다.
   * @param userId 사용자 ID (본인 확인용)
   * @param id 삭제할 독서 기록 ID
   */
  async remove(userId: number, id: string) {
    const log = await this.readingLogRepository.findOne({
      where: { id, userId },
    });
    if (!log) {
      throw new NotFoundException('Reading log not found');
    }
    await this.readingLogRepository.remove(log);
  }
}
