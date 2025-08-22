import {
  Component,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

import { CiuiIcon } from '../../../components';
import { Size } from '../../constants';
import { FormErrorService } from '../../services/form-error.service';

@Component({
  selector: 'ciui-input-info',
  imports: [CiuiIcon],
  templateUrl: './input-info.html',
  encapsulation: ViewEncapsulation.None,
})
export class CiuiInputInfo {
  formErrorService = inject(FormErrorService);

  id = input.required<string>();
  label = input.required<string>();

  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  row = input<boolean, any>(false, { transform: booleanAttribute });

  @HostBinding('class')
  get hostClasses() {
    return [
      'ciui-input__info',
      this.labelInvisible() && !this.formErrorService.hasErrors() ? 'ciui-a11y-hidden' : '',
    ];
  }
}
