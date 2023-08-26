import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ROLESENUM } from '../base/base.entity';
import { TandCDetails } from './dto/inputs';
import {
  GetUserStatisticsResponse,
  TermsAndConditionResponse,
} from './dto/response';
import { User } from './models/users.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //query *************
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLESENUM.ADMIN, ROLESENUM.USER, ROLESENUM.SUPER_ADMIN)
  async getUser(@AuthUser() user: User): Promise<User> {
    return this.userService.getUser(user.id);
  }

  @Get('admin_get_user_statistics')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLESENUM.ADMIN, ROLESENUM.SUPER_ADMIN)
  async userStatistics(): Promise<GetUserStatisticsResponse> {
    try {
      return this.userService.getUserStatistics();
    } catch (error) {
      throw new Error(error);
    }
  }

  //Mutations ****************
  @Post('terms-and-condition')
  acceptTermsandCondition(
    @AuthUser() user,
    @Body()
    tandCDetails: TandCDetails,
  ): Promise<TermsAndConditionResponse> {
    try {
      return this.userService.acceptTermsAndcondition(user.id, tandCDetails);
    } catch (error) {
      throw new Error(error);
    }
  }
}
