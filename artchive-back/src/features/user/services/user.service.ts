import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SocialLoginDto } from '@/features/auth/dtos/social-login.dto';
import { UsedBookSale } from '@/features/book/entities/used-book-sale.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UsedBookSale)
    private readonly usedBookSaleRepository: Repository<UsedBookSale>,
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
}
