import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiBaseInput } from '../../shared/components/base-input/base-input';

@Component({
  selector: 'ciui-checkbox',
  imports: [ReactiveFormsModule, CiuiInputInfo],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
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
export class CiuiCheckbox extends CiuiBaseInput {
  constructor() {
    super();
  }

  @HostBinding('class')
  override get hostClasses() {
    return [...super.hostClasses, 'ciui-checkbox'];
  }

  onInput(event: Event) {
    this._resetAngryDelete();
    const newValue = (event.target as HTMLInputElement).checked;
    this._onChange(newValue);
  }

  applyWrite(value: boolean) {
    this._renderer.setProperty(this._checkboxRef().nativeElement, 'checked', value);
  }

  protected _checkboxRef = viewChild.required<ElementRef<HTMLInputElement>>('checkbox');
  activeElements = computed(() => [this._checkboxRef().nativeElement]);
}
