import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  TemplateRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { firstValueFrom, Subject, Subscription } from 'rxjs';

import type { Nullable } from '@curseit/types';

import { CiuiBaseInput } from '../../shared/components/base-input/base-input';
import { CiuiInputInfo } from '../../shared/components/input-info/input-info';
import { invertTheme, reduceTheme } from '../../shared/constants';
import { FormErrorService } from '../../shared/services/form-error.service';
import { debounceOutput } from '../../shared/utils/debounce-output';
import { CiuiButton } from '../button/button';
import { CiuiContextMenu } from '../context-menu/context-menu';
import { CiuiContextMenuTrigger } from '../context-menu/context-menu-trigger.directive';
import { CiuiIcon } from '../icon/icon';
import { CiuiLoader } from '../loader/loader';

import { SelectService } from './select.service';

export type SelectOption = {
  id: string;
  utility?: 'add' | 'nothing-found';
  [key: string]: any;
};
export type FocusSource = 'mouse' | 'keyboard';

export type SelectAddOptionPayload<T> = {
  add: string;
  finished$: Subject<Nullable<T>>;
};

export type SelectEditOptionPayload<T> = {
  option: T;
  edit: string;
  finished$: Subject<Nullable<T>>;
};

export type SelectRemoveOptionPayload<T> = {
  option: T;
  finished$: Subject<void>;
};

@Component({
  selector: 'ciui-select',
  imports: [
    ReactiveFormsModule,
    CiuiButton,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiIcon,
    CiuiInputInfo,
    CiuiLoader,
    NgTemplateOutlet,
  ],
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
export class CiuiSelect<T extends string | SelectOption> extends CiuiBaseInput {
  private _injector = inject(Injector);
  selectService = inject(SelectService);
  element = inject(ElementRef);

  optionsSource = input.required<Array<T>>({ alias: 'options' });

  labelKey = input<string>('label');
  searchDebounce = input(500);
  optionsLoading = input<boolean, any>(false, { transform: booleanAttribute });
  editable = input<boolean, any>(false, { transform: booleanAttribute });
  addInputPlaceholder = input<string>('Item name');
  addInputAriaLabel = input<string>('Enter item name');
  addItemAriaLabel = input<string>('Add item');
  selectOnAdd = input<boolean, any>(false, { transform: booleanAttribute });
  editInputPlaceholder = input<string>('Item name');
  editInputAriaLabel = input<string>('Enter item name');
  editItemAriaLabel = input<string>('Edit item');

  searched = output<string>();
  searchedDebounced = outputFromObservable(debounceOutput(this.searched, this.searchDebounce()));
  focus = output();
  blur = output();
  add = output<SelectAddOptionPayload<T>>();
  remove = output<SelectRemoveOptionPayload<T>>();
  edit = output<SelectEditOptionPayload<T>>();

  searchControl = new FormControl('', { nonNullable: true });
  newOptionName = new FormControl('', { nonNullable: true });
  editOptionName = new FormControl('', { nonNullable: true });

  isValueSelected = signal(false);
  focusData = signal<[Nullable<number>, Nullable<FocusSource>]>([null, null]);
  searchDebounceIsActive = signal(false);
  adding = signal(false);
  addingLoading = signal(false);
  editing = signal<Nullable<SelectOption>>(null);
  editingLoading = signal(false);
  removingLoading = signal(false);

  activeElements = computed(() => [
    this._searchRef().nativeElement,
    this._contextMenuRef().element.nativeElement,
  ]);
  isFocused = computed(() => {
    return this.selectService.focusedSelect() === this;
  });
  selectedOption = computed(() => {
    const selectedValue = this._selectedValueSignal();
    return selectedValue ? this._normalizeOption(selectedValue) : null;
  });
  normalizedOptions = computed(() => {
    const selectedOption = this.selectedOption();
    const normalizedOptions = this.optionsSource()
      .map(this._normalizeOption.bind(this))
      .filter(({ id }) => id !== selectedOption?.id);

    if (selectedOption) {
      normalizedOptions.unshift(selectedOption);
    }

    return normalizedOptions;
  });
  filteredOptions = computed(() => {
    const search = this._searchSignal();
    const filteredOptions = this.normalizedOptions()
      .filter(option => {
        const optionLabel = option[this.labelKey()].toLocaleLowerCase();
        return optionLabel.includes(search.toLocaleLowerCase());
      })
      .sort((optionA, optionB) => {
        return optionA[this.labelKey()].length - optionB[this.labelKey()].length;
      });

    if (!filteredOptions.length) {
      filteredOptions.push({
        id: `${this.id()}_nothing-found`,
        utility: 'nothing-found',
        [this.labelKey()]: 'Nothing found...',
      });
    }

    return filteredOptions;
  });
  options = computed(() => {
    const options =
      this._searchSignal() && !this.isValueSelected()
        ? this.filteredOptions()
        : this.normalizedOptions();

    if (this.editable()) {
      return [
        ...options,
        {
          id: `${this.id()}_add`,
          utility: 'add',
        },
      ] as Array<SelectOption>;
    }

    return options;
  });
  focusedOption = computed<Nullable<SelectOption>>(() => {
    return this.options()[this.focusData()[0] ?? 0] ?? null;
  });
  maxFocusIndex = computed(() => this.options().length - 1);
  menuTheme = computed(() => {
    return reduceTheme(this.theme());
  });
  invertedTheme = computed(() => {
    return invertTheme(this.theme());
  });
  isLoading = computed(() => {
    return this.optionsLoading() || this.searchDebounceIsActive();
  });
  isAddingFocused = computed(() => {
    return this.focusedOption()?.utility === 'add';
  });
  isNothingFoundFocused = computed(() => {
    return this.focusedOption()?.utility === 'nothing-found';
  });

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.selectService.register(this);

    this._selectedValueSignal.set(this.formControl().value);
    this._formControlValueSubscription = this.formControl().valueChanges.subscribe(value => {
      this._selectedValueSignal.set(value);
    });
  }

  ngOnDestroy() {
    this.selectService.unregister(this);

    if (this._formControlValueSubscription) {
      this._formControlValueSubscription.unsubscribe();
    }
  }

  selectFocusedOption(force = false) {
    const focusedOption = this.focusedOption();
    const [focusedIndex, focusSource] = this.focusData();
    const { value: searchValue } = this.searchControl;
    if (
      focusedOption &&
      !focusedOption.utility &&
      // the last focus move was done through keyboard
      (
        force ||
        (focusedIndex !== null && focusSource === 'keyboard') ||
        // there is search value set by user
        (searchValue && !this.isValueSelected())
      )
    ) {
      this.selectOption(focusedOption);
    }
  }

  selectOption(option: SelectOption) {
    const originalOption = this._getOriginalOption(option);
    this._onChange(originalOption);
    this._renderer.setProperty(this._searchRef().nativeElement, 'value', option[this.labelKey()]);
    this.isValueSelected.set(true);
    this.formControl().markAsTouched();
    this.element.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  moveFocus(increment: number) {
    const [focusedIndex] = this.focusData();
    const { length } = this.options();
    if (focusedIndex === null) {
      this.focusData.set([increment > 0 ? 1 : length - 1, 'keyboard']);
    } else {
      const newIndex = (focusedIndex + increment) % length;
      this.focusData.set([newIndex === -1 ? length - 1 : newIndex, 'keyboard']);
    }
  }

  focusAdd(index: number) {
    this.focusData.set([index, 'keyboard']);
  }

  handleEnterPress() {
    const adding_ = this.adding();
    const editing_ = this.editing();
    const isAddingFocused_ = this.isAddingFocused();
    const focusedOption_ = this.focusedOption();
    if (isAddingFocused_ && !adding_) {
      this.startAdding();

      return;
    } else if (adding_ && (isAddingFocused_ || this.focusData()[1] !== 'keyboard')) {
      /**
       * If the user is adding an option, and they didn't move the focus with keyboard.
       * This is in case the user moves their mouse accidentally, we still consider their
       * intention being adding a new option. Otherwise, if the user moves focus using keyboard,
       * we consider this as an intention to select an existing option.
       */
      this.handleAdd();

      return;
    } else if (
      editing_ &&
      this.editOptionName.value.length &&
      focusedOption_ === editing_
    ) {
      this.handleEdit(editing_);

      return;
    } else if (this.isNothingFoundFocused()) {
      return;
    }

    this.selectFocusedOption(true);
    this.selectService.unfocus(this, false);
  }

  handleSpacePress(event: Event) {
    if (
      this.isAddingFocused() &&
      this._searchRef().nativeElement.contains(document.activeElement)
    ) {
      event.preventDefault();
      this.startAdding();
    }
  }

  handleEscapePress() {
    if (this.adding()) {
      this.resetAdding();

      return;
    }

    if (this.editing()) {
      this.resetEditing();

      return;
    }

    this.selectService.unfocus(this);
  }

  handleSearchInput() {
    this._resetAngryDelete();
    this.searchDebounceIsActive.set(true);
    this.isValueSelected.set(false);
    this.searched.emit(this.searchControl.value);
    this.focusData.set([null, null]);

    if (this._searchDebounceTimeout) {
      clearTimeout(this._searchDebounceTimeout);
    }

    this._searchDebounceTimeout = setTimeout(() => {
      this.searchDebounceIsActive.set(false);
      this._searchDebounceTimeout = null;
    }, this.searchDebounce());
  }

  async handleAdd() {
    if (!this.newOptionName.value.length) {
      return;
    }

    const finished$ = new Subject<Nullable<T>>();

    this.addingLoading.set(true);

    this.add.emit({ add: this.newOptionName.value, finished$ });

    const newOption = await firstValueFrom(finished$);

    this.addingLoading.set(false);

    if (this.selectOnAdd() && newOption) {
      // allow this.optionsSource to get updated
      afterNextRender(() => {
        this.selectOption(this._normalizeOption(newOption));
        this.selectService.unfocus(this, false);
      }, { injector: this._injector });
    } else {
      this.resetAdding();
    }
  }

  handleChevronClick() {
    if (this.isFocused()) {
      this.selectService.unfocus(this);
    } else {
      this.selectService.focus(this);
    }
  }

  handleOptionClick(option: SelectOption) {
    if (option.utility || this.editing() === option) {
      return;
    }

    this.selectOption(option);
    this.selectService.unfocus(this, false);
  }

  handleOptionHover(option: SelectOption) {
    this.focusData.set([this.options().indexOf(option), 'mouse']);
  }

  startEditing(option: SelectOption) {
    this.editing.set(option);

    afterNextRender(() => {
      const editInputRef = this._editInputRef();
    
      if (editInputRef) {
        editInputRef.nativeElement.focus();   
        this._renderer.setProperty(
          editInputRef.nativeElement,
          'value',
          option[this.labelKey()],
        );
      }
    }, { injector: this._injector });
  }

  async handleEdit(option: SelectOption) {
    const originalOption = this._getOriginalOption(option);
    if (!originalOption || !this.editOptionName.value) {
      return;
    }

    const finished$ = new Subject<Nullable<T>>();

    this.editingLoading.set(true);

    this.edit.emit({ option: originalOption, edit: this.editOptionName.value, finished$ });

    const editedOption = await firstValueFrom(finished$);

    this.editingLoading.set(false);

    if (option.id === this.selectedOption()?.id) {
      this.formControl().setValue(editedOption);
    }

    this.resetEditing();
  }

  async handleRemove(option: SelectOption) {
    const originalOption = this._getOriginalOption(option);
    if (!originalOption) {
      return;
    }

    const finished$ = new Subject<void>();

    this.removingLoading.set(true);

    this.remove.emit({ option: originalOption, finished$ });

    await firstValueFrom(finished$);

    if (option.id === this.selectedOption()?.id) {
      this.formControl().setValue(null);
    }

    this.removingLoading.set(false);
  }

  startAdding() {
    this.adding.set(true);
    afterNextRender(
      () => {
        const addInputRef = this._addInputRef();
        if (!addInputRef) {
          return;
        }

        if (this.filteredOptions()[0]?.utility === 'nothing-found') {
          const searchPrompt = this._searchRef().nativeElement.value;
          this.newOptionName.setValue(searchPrompt);
          this._renderer.setProperty(addInputRef.nativeElement, 'value', searchPrompt);
        }

        addInputRef.nativeElement.focus();
      },
      { injector: this._injector },
    );
  }

  resetAdding() {
    this.newOptionName.setValue('');
    this.adding.set(false);
  }

  resetEditing() {
    this.editOptionName.setValue('');
    this.editing.set(null);
  }

  applyWrite(option: Nullable<string | SelectOption>) {
    this.searchControl.setValue(option ? this._normalizeOption(option)[this.labelKey()] : '');
    this.isValueSelected.set(Boolean(option));
  }

  override setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.searchControl.disable();
      this._renderer.setAttribute(this._contextMenuRef().element.nativeElement, 'disabled', '');
    } else {
      this.searchControl.enable();
      this._renderer.removeAttribute(this._contextMenuRef().element.nativeElement, 'disabled');
    }
  }

  @HostBinding('class')
  override get hostClasses() {
    return [...super.hostClasses, 'ciui-select'];
  }

  @HostListener('focusin')
  handleFocusin() {
    this.selectService.focus(this);
  }

  // should only be used from SelectService
  _focus(onlyNative = false) {
    this._searchRef().nativeElement.focus();
    if (onlyNative) {
      return;
    }

    this._contextMenuRef().toggle(true);
    this.focus.emit();
  }

  // should only be used from SelectService
  _unfocus(selectAllowed = true) {
    if (selectAllowed) {
      this.selectFocusedOption();
    }

    this.focusData.set([null, null]);
    this.resetAdding();
    this.resetEditing();
    this.searchControl.setValue(this.selectedOption()?.[this.labelKey()] ?? '');
    this._searchRef().nativeElement.blur();
    if (this._contextMenuRef().isOpen()) {
      this._contextMenuRef().toggle(false);
    }

    this.blur.emit();
  }

  readonly iconTemplate = contentChild('icon', { read: TemplateRef });
  readonly optionTemplate = contentChild('item', { read: TemplateRef });

  protected _searchRef = viewChild.required<ElementRef<HTMLInputElement>>('search');
  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');
  protected _addInputRef = viewChild<ElementRef<HTMLInputElement>>('addInput');
  protected _editInputRef = viewChild<ElementRef<HTMLInputElement>>('editInput');

  private _searchSignal = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });
  private _selectedValueSignal = signal<Nullable<string | SelectOption>>(null);
  private _searchDebounceTimeout: Nullable<number> = null;
  private _formControlValueSubscription: Nullable<Subscription> = null;

  private _getOriginalOption(option: SelectOption) {
    return this.optionsSource().find(originalOption => {
      const originalOptionId = typeof originalOption === 'string'
        ? originalOption
        : originalOption.id;
      return originalOptionId === option.id;
    }) ?? null;
  }
  private _normalizeOption(option: string | SelectOption) {
    return typeof option === 'string' ? { id: option, [this.labelKey()]: option } : option;
  }
}
