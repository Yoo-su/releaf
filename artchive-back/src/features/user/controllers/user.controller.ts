import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내가 등록한 모든 판매글을 조회하는 엔드포인트
   */
  @Get('my-sales')
  @UseGuards(AuthGuard('jwt'))
  async getMySales(@CurrentUser() user: User) {
    const userId = user.id;
    const sales = await this.userService.findMySales(userId);
    return {
      success: true,
      sales: sales,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getUser(@CurrentUser() user: User) {
    return user;
  }
}
