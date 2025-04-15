import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  FdcDataTypeEnumSchema,
  FdcSearchResponseDataSchema,
  FdcSearchResultFood,
} from './external/fdc.types';
import { SearchDto } from '../../dto/search.dto';

@Injectable()
export class FdcService {
  constructor(private readonly httpService: HttpService) {}

  async searchFoods(search: SearchDto): Promise<Array<FdcSearchResultFood>> {
    const response = this.httpService.get('/foods/search', {
      params: {
        query: search.name,
        dataType: FdcDataTypeEnumSchema.Values.Foundation,
      },
    });

    const { data } = await firstValueFrom(response);

    const validationResult = FdcSearchResponseDataSchema.safeParse(data);

    if (!validationResult.success) {
      throw validationResult.error;
    }

    return validationResult.data.foods;
  }
}
