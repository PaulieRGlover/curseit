import { Controller, Get, UseGuards } from '@nestjs/common';

import { GetUser } from '@/decorators';
import { UserDto } from '@/dto';
import { AccessJwtGuard } from '@/guards';

import { FridgeService } from './fridge.service';

@UseGuards(AccessJwtGuard)
@Controller('fridge')
export class FridgeController {
  constructor(private fridgeService: FridgeService) {}

  @Get('foods')
  getFoods(@GetUser() user: UserDto) {
    return this.fridgeService.getUserFoods(user.id);
  }
}
