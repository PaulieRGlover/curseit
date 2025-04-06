import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FdcService {
  constructor(private readonly httpService: HttpService) {}

  async searchFoods(query: string): Promise<unknown> {
    const response = this.httpService.get(`/foods/search?query=${query}&dataType=Foundation`);

    const { data } = await firstValueFrom(response);

    return data;
  }
}
