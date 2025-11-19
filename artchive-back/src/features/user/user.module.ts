import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UsedBookSale } from '../book/entities/used-book-sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsedBookSale])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
