import { API } from '@/core/constants/api.constants';
import { DietResource } from '@/core/diet.resource';
import { AuthService } from '@/features/auth/auth.service';
import { inject, Injectable } from '@angular/core';
import { Get, Resource, UseAuthorization, UseValidation } from '@curseit/resource';

@Injectable({ providedIn: 'root' })
@Resource(API.FRIDGE.BASE)
export class FoodsResource extends DietResource {
  // validation = inject()

  @Get(API.FRIDGE.FOODS)
  @UseAuthorization()
  // @UseValidation('foods')
  async getFoods() {}
}
