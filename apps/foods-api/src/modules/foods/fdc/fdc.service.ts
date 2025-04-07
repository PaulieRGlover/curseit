import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  FdcSearchResponseDataSchema,
  FdcSearchResultFood,
} from './external/fdc.types';

@Injectable()
export class FdcService {
  constructor(private readonly httpService: HttpService) {}

  async searchFoods(query: string): Promise<Array<FdcSearchResultFood>> {
    const response = this.httpService.get(`/foods/search?query=${query}&dataType=Foundation`);

    const { data } = await firstValueFrom(response);

    const validationResult = FdcSearchResponseDataSchema.safeParse(data);

    if (!validationResult.success) {
      throw validationResult.error;
    }

    return validationResult.data.foods;
  }
}
