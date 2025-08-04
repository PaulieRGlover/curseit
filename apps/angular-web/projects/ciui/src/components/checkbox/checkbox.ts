import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { MaybeUndefined } from '@curseit/types';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { InputInfo } from '../../shared/components/input-info/input-info';
import { SIZES, THEMES } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';

@Component({
  selector: 'ciui-checkbox',
  imports: [ReactiveFormsModule, InputInfo],
  templateUrl: './checkbox.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiCheckbox),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiCheckbox extends BaseInput {
  formErrorService = inject(FormErrorService);

  @Input({ required: true }) formControl!: FormControl;
  @Input({ required: true }) label!: string;

  @Input() name: MaybeUndefined<string>;
  @Input() value: boolean = false;
  @Input() ariaLabel: MaybeUndefined<string>;

  @Input({ transform: booleanAttribute }) labelInvisible = false;
  @Input({ transform: booleanAttribute }) row = false;
  @Input() theme: THEMES = 'white';
  @Input() size: SIZES = 'default';
  @Input({ transform: booleanAttribute }) transparent = false;

  constructor() {
    super();
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes, 'ciui-input--checkbox'];
  }

  onInput(event: Event) {
    const newValue = (event.target as HTMLInputElement).checked;
    this.value = newValue;
    this.onChange(newValue);
  }
}
