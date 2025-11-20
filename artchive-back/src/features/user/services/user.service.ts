import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SocialLoginDto } from '@/features/auth/dtos/social-login.dto';
import {
  UsedBookSale,
  SaleStatus,
} from '@/features/book/entities/used-book-sale.entity';
import { ChatParticipant } from '@/features/chat/entities/chat-participant.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UsedBookSale)
    private readonly usedBookSaleRepository: Repository<UsedBookSale>,
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({ where: { provider, providerId } });
  }

  async createUser(socialLoginDto: SocialLoginDto): Promise<User> {
    const newUser = this.userRepository.create(socialLoginDto);
    return await this.userRepository.save(newUser);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * 특정 사용자가 작성한 모든 중고책 판매글을 조회합니다.
   * @param userId - 사용자 ID
   * @returns 사용자의 판매글 목록
   */
  async findMySales(userId: number): Promise<UsedBookSale[]> {
    return this.usedBookSaleRepository.find({
      where: { user: { id: userId } },
      relations: ['book', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserStats(userId: number) {
    // 1. 판매글 통계
    const sales = await this.usedBookSaleRepository.find({
      where: { user: { id: userId } },
      select: ['status'],
    });

    const salesCount = sales.length;
    const salesStatusCounts = sales.reduce(
      (acc, sale) => {
        acc[sale.status] = (acc[sale.status] || 0) + 1;
        return acc;
      },
      {} as Record<SaleStatus, number>,
    );

    // 2. 채팅방 통계 (활성화된 채팅방 수)
    const chatRoomCount = await this.chatParticipantRepository.count({
      where: { user: { id: userId }, isActive: true },
    });

    return {
      salesCount,
      salesStatusCounts,
      chatRoomCount,
    };
  }

  async withdraw(userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      // 1. 사용자 정보 익명화
      const timestamp = new Date().getTime();
      user.nickname = '(알수없음)';
      user.profileImageUrl = null as any;
      user.providerId = `deleted_${user.id}_${timestamp}`;
      user.email = `deleted_${user.id}_${timestamp}`;
      user.deletedAt = new Date();

      await queryRunner.manager.save(user);

      // 2. 모든 상품 숨김 처리 (WITHDRAWN)
      await queryRunner.manager.update(
        UsedBookSale,
        { user: { id: userId } },
        { status: SaleStatus.WITHDRAWN },
      );

      // 3. 채팅방 참여 상태 비활성화 (isActive = false)
      await queryRunner.manager.update(
        ChatParticipant,
        { user: { id: userId } },
        { isActive: false },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
