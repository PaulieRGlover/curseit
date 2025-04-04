import { Controller, Get, Injectable } from '@nestjs/common';
import { AppService } from './app.service';

@Injectable()
@Controller('app')
export class AppController {
  constructor(private service: AppService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Get('some-food')
  async getSomeFood() {
    return await this.service.getSomeFood();
  }
};
