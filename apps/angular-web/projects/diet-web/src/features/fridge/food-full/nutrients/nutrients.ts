import { Component, Input } from '@angular/core';

import { NutrientDto } from '../../dto/internal/nutrient.dto';
import { CidNutrient } from '../nutrient/nutrient';

@Component({
  selector: 'cid-nutrients',
  imports: [CidNutrient],
  templateUrl: './nutrients.html',
})
export class CidNutrients {
  @Input({ required: true }) nutrients!: Array<NutrientDto>;
}
