import { GetUser } from '@/decorators';
import { AccessJwtGuard } from '@/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { type UserDto } from '@/dto';

@UseGuards(AccessJwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  me(@GetUser() user: UserDto) {
    return user;
  }
}
