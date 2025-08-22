import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import type { Nullable } from '@curseit/types';

import { BaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { Size, Theme } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';
import { CiuiContextMenu } from '../context-menu/context-menu';
import { CiuiContextMenuTriggerDirective } from '../context-menu/context-menu.directive';
import { debounceOutput } from '../../public-api';

export type SelectOption = {
  id: string;
  [key: string]: any;
};

@Component({
  selector: 'ciui-select',
  imports: [ReactiveFormsModule, CiuiInputInfo, CiuiContextMenu, CiuiContextMenuTriggerDirective],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiuiSelect),
      multi: true,
    },
    FormErrorService,
  ],
})
export class CiuiSelect extends BaseInput {
  element = inject(ElementRef);
  formErrorService = inject(FormErrorService);

  formControl = input.required<FormControl>();
  label = input.required<string>();
  options = input.required<Array<string> | Array<SelectOption>>();

  name = input<string>();
  labelKey = input<string>('label');
  placeholder = input<string>();
  ariaLabel = input<string>();
  labelInvisible = input<boolean, any>(false, { transform: booleanAttribute });
  row = input<boolean, any>(false, { transform: booleanAttribute });
  theme = input<Theme>('white');
  size = input<Size>('medium');
  transparent = input<boolean, any>(false, { transform: booleanAttribute });
  searchDebounce = input(500);

  search = output<string>();
  searchDebounced = outputFromObservable(debounceOutput(this.search, this.searchDebounce()));

  searchControl = new FormControl('', { nonNullable: true });

  isValueSelected = signal(false);
  focusedIndex = signal<Nullable<number>>(null);

  normalizedOptions = computed<Array<SelectOption>>(() =>
    this.options().map(option => {
      return typeof option === 'string' ? { id: option, [this.labelKey()]: option } : option;
    }),
  );
  filteredOptions = computed<Array<SelectOption>>(() => {
    const search = this._searchSignal();
    return search && !this.isValueSelected()
      ? this.normalizedOptions().filter(option => {
          const optionLabel = option[this.labelKey()].toLocaleLowerCase();
          return optionLabel.includes(search.toLocaleLowerCase());
        })
      : this.normalizedOptions();
  });

  constructor() {
    super();
  }

  handleEnterPress() {
    const focusedIndex = this.focusedIndex();
    if (focusedIndex === null) {
      return;
    }

    const option = this.filteredOptions()[focusedIndex];
    if (!option) {
      return;
    }

    this.handleSelect(option);
  }

  handleFocusMove(increment: number) {
    const focusedIndex = this.focusedIndex();
    const filteredOptions = this.filteredOptions();
    const { length } = filteredOptions;
    if (focusedIndex === null) {
      this.focusedIndex.set(increment > 0 ? 0 : length - 1);
    } else {
      const newIndex = (focusedIndex + increment) % length;
      this.focusedIndex.set(newIndex === -1 ? length - 1 : newIndex);
    }
  }

  handleSearchInput() {
    if (!this.searchControl.value) {
      return;
    }

    this.search.emit(this.searchControl.value);
  }

  handleSearchClick() {
    this._contextMenuRef().toggle(true);
  }

  handleSearchChange(event: Event) {
    event.stopPropagation();
  }

  handleSelect(option: SelectOption) {
    const originalOption = this.options().find(originalOption => {
      return (
        (typeof originalOption === 'string' ? originalOption : originalOption.id) === option.id
      );
    });
    this._onChange(originalOption);
    this._contextMenuRef().toggle(false);
    this._renderer.setProperty(this._selectRef().nativeElement, 'value', option[this.labelKey()]);
    this.isValueSelected.set(true);
    this.focusedIndex.set(null);
    this.formControl().markAsTouched();
    this.element.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  handleOptionHover(option: SelectOption) {
    this.focusedIndex.set(this.filteredOptions().indexOf(option));
  }

  applyWrite(option: string | SelectOption) {
    this._renderer.setProperty(
      this._selectRef().nativeElement,
      'value',
      typeof option === 'string' ? option : option[this.labelKey()],
    );
  }

  @HostBinding('class')
  get hostClasses() {
    return [...this.classes(), 'ciui-select'];
  }

  protected _selectRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('select');
  protected _contextMenuRef = viewChild.required(CiuiContextMenu);
  private _searchSignal = toSignal(this.searchControl.valueChanges, { initialValue: this.searchControl.value });
}
