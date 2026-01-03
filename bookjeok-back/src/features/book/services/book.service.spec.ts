import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BookService } from './book.service';
import { Book } from '../entities/book.entity';
import { SaleStatus, UsedBookSale } from '../entities/used-book-sale.entity';
import { UserService } from '../../user/services/user.service';
import { BusinessException } from '@/shared/exceptions';

// 테스트에서 사용되는 Mock 생성 헬퍼
const createMockSale = (overrides = {}): UsedBookSale =>
  ({
    id: 1,
    title: '테스트 판매글',
    price: 15000,
    status: SaleStatus.FOR_SALE,
    city: '서울특별시',
    district: '강남구',
    latitude: 37.123456,
    longitude: 127.123456,
    placeName: '스타벅스 앞',
    content: '테스트 내용입니다.',
    imageUrls: ['https://example.com/sale-image.jpg'],
    viewCount: 0,
    user: { id: 1 },
    book: { isbn: '9788956746425' },
    chatRooms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as UsedBookSale;

describe('BookService', () => {
  let service: BookService;
  let mockUsedBookSaleRepository: Record<string, jest.Mock>;
  let mockUserService: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockUsedBookSaleRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      merge: jest.fn(),
      increment: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockBookRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      increment: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockUserService = {
      findById: jest.fn(),
    };

    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(UsedBookSale),
          useValue: mockUsedBookSaleRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('서비스가 정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('findSaleById', () => {
    it('존재하는 판매글을 조회하면 반환해야 합니다', async () => {
      const mockSale = createMockSale();
      mockUsedBookSaleRepository.findOne.mockResolvedValue(mockSale);

      const result = await service.findSaleById(1);

      expect(result).toEqual(mockSale);
      expect(mockUsedBookSaleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'book'],
      });
    });

    it('존재하지 않는 판매글 조회 시 BusinessException을 던져야 합니다', async () => {
      mockUsedBookSaleRepository.findOne.mockResolvedValue(null);

      try {
        await service.findSaleById(999);
        fail('예외가 발생해야 합니다');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessException);
        expect((error as BusinessException).errorCode).toBe('SALE_NOT_FOUND');
        expect((error as BusinessException).getStatus()).toBe(
          HttpStatus.NOT_FOUND,
        );
      }
    });
  });

  describe('updateSaleStatus', () => {
    it('판매글 소유자가 상태를 변경할 수 있어야 합니다', async () => {
      const mockSale = createMockSale({ user: { id: 1 } });
      mockUsedBookSaleRepository.findOne.mockResolvedValue(mockSale);
      mockUsedBookSaleRepository.save.mockResolvedValue({
        ...mockSale,
        status: SaleStatus.RESERVED,
      });

      const result = await service.updateSaleStatus(1, 1, SaleStatus.RESERVED);

      expect(result.status).toBe(SaleStatus.RESERVED);
    });

    it('소유자가 아닌 사용자가 상태 변경 시 SALE_FORBIDDEN 에러를 던져야 합니다', async () => {
      const mockSale = createMockSale({ user: { id: 1 } });
      mockUsedBookSaleRepository.findOne.mockResolvedValue(mockSale);

      try {
        await service.updateSaleStatus(1, 999, SaleStatus.RESERVED);
        fail('예외가 발생해야 합니다');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessException);
        expect((error as BusinessException).errorCode).toBe('SALE_FORBIDDEN');
        expect((error as BusinessException).getStatus()).toBe(
          HttpStatus.FORBIDDEN,
        );
      }
    });

    it('존재하지 않는 판매글의 상태 변경 시 SALE_NOT_FOUND 에러를 던져야 합니다', async () => {
      mockUsedBookSaleRepository.findOne.mockResolvedValue(null);

      try {
        await service.updateSaleStatus(999, 1, SaleStatus.RESERVED);
        fail('예외가 발생해야 합니다');
      } catch (error) {
        expect((error as BusinessException).errorCode).toBe('SALE_NOT_FOUND');
      }
    });
  });

  describe('deleteUsedBookSale', () => {
    it('판매글 소유자가 삭제할 수 있어야 합니다', async () => {
      const mockSale = createMockSale({ user: { id: 1 } });
      mockUsedBookSaleRepository.findOne.mockResolvedValue(mockSale);
      mockUsedBookSaleRepository.remove.mockResolvedValue(mockSale);

      await expect(service.deleteUsedBookSale(1, 1)).resolves.toBeUndefined();
      expect(mockUsedBookSaleRepository.remove).toHaveBeenCalled();
    });

    it('소유자가 아닌 사용자가 삭제 시 SALE_FORBIDDEN 에러를 던져야 합니다', async () => {
      const mockSale = createMockSale({ user: { id: 1 } });
      mockUsedBookSaleRepository.findOne.mockResolvedValue(mockSale);

      try {
        await service.deleteUsedBookSale(1, 999);
        fail('예외가 발생해야 합니다');
      } catch (error) {
        expect((error as BusinessException).errorCode).toBe('SALE_FORBIDDEN');
      }
    });
  });

  describe('incrementViewCount', () => {
    it('판매글 조회수를 증가시켜야 합니다', async () => {
      mockUsedBookSaleRepository.increment.mockResolvedValue({ affected: 1 });

      await service.incrementViewCount(1);

      expect(mockUsedBookSaleRepository.increment).toHaveBeenCalledWith(
        { id: 1 },
        'viewCount',
        1,
      );
    });
  });

  describe('createUsedBookSale', () => {
    it('존재하지 않는 유저로 생성 시 USER_NOT_FOUND 에러를 던져야 합니다', async () => {
      mockUserService.findById.mockResolvedValue(null);

      const dto = {
        title: '테스트 판매글',
        price: 10000,
        city: '서울',
        district: '강남',
        latitude: 37.123,
        longitude: 127.123,
        content: '테스트 내용입니다 10자 이상',
        imageUrls: ['https://example.com/image.jpg'],
        book: {
          isbn: '9788956746425',
          title: '책 제목',
          author: '저자',
          publisher: '출판사',
          description: '설명',
          image: 'https://example.com/book.jpg',
          pubdate: '20230101',
        },
        placeName: '스타벅스',
      };

      try {
        await service.createUsedBookSale(dto, 999);
        fail('예외가 발생해야 합니다');
      } catch (error) {
        expect((error as BusinessException).errorCode).toBe('USER_NOT_FOUND');
      }
    });
  });
});
