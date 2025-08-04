import { Component, Input, booleanAttribute, inject } from '@angular/core';

import { CiuiIcon } from '../../../components';
import { SIZES } from '../../constants';
import { FormErrorService } from '../../services/form-error.service';

@Component({
  selector: 'ciui-input-info',
  imports: [CiuiIcon],
  templateUrl: './input-info.html',
  host: {
    class: 'ciui-input__info',
    '[class.ciui-a11-hidden]': 'labelInvisible && !formErrorService.hasErrors()',
  }
})
export class InputInfo {
  formErrorService = inject(FormErrorService);

  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;

  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input({ transform: booleanAttribute }) row = false;
  @Input() size: SIZES = 'default';
}
