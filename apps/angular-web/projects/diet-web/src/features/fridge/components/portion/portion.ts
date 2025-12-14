import {
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  CiuiCheckbox,
  CiuiContextMenu,
  CiuiContextMenuTrigger,
  CiuiDateInput,
  CiuiLoader,
  CiuiNumberInput,
  CiuiSelect,
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS } from '@curseit/units';

import { FOOD_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { PortionsStore } from '../../store/portions.store';
import { VariationsStore } from '../../store/variations.store';
import { Portion } from '../../types/external/portion.types';
import { VariationAbridged } from '../../types/external/variation.types';
import { Counter, PortionSizeUnit, PortionSizeValue } from '../../types/internal/variation.types';
import { CidEmojiPicker } from '../emoji-picker/emoji-picker';
import { CidPortionBadge } from '../portion-badge/portion-badge';

import { portionModelToPortionUpdate } from './transformers/portion-model-to-portion-update';
import { portionToPortionModel } from './transformers/portion-to-portion-model';
import { RemainingUnit, RemainingValue } from './types/portion.types';
import { PortionValidationService } from './validation/portion-validation.service';

@Component({
  selector: 'cid-portion',
  imports: [
    ReactiveFormsModule,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiDateInput,
    CiuiLoader,
    CiuiNumberInput,
    CiuiSelect,
    CidPortionBadge,
    CidEmojiPicker,
  ],
  templateUrl: './portion.html',
  styleUrl: './portion.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortion {
  fridgeService = inject(FridgeService);
  variationsStore = inject(VariationsStore);
  portionsStore = inject(PortionsStore);
  validationService = inject(PortionValidationService);

  portionInput = input.required<Portion>({ alias: 'portion' });
  selected = input(false);

  selectToggled = output();

  portionForm = new FormGroup({
    variation: new FormControl<Nullable<VariationAbridged>>(null),
    dateAdded: new FormControl<Date>(new Date(), { nonNullable: true }),
    dateExpiring: new FormControl<Nullable<Date>>(null),
    portionSizeValue: new FormControl<PortionSizeValue>(100, {
      asyncValidators: this.validationService.portionSizeValue,
      nonNullable: true,
    }),
    portionSizeUnit: new FormControl<PortionSizeUnit>(UNITS.GRAM, {
      asyncValidators: this.validationService.portionSizeUnit,
      nonNullable: true,
    }),
    remainingValue: new FormControl<RemainingValue>(100, {
      asyncValidators: this.validationService.remainingValue,
      nonNullable: true,
    }),
    remainingUnit: new FormControl<RemainingUnit>(UNITS.GRAM, {
      asyncValidators: this.validationService.remainingUnit,
      nonNullable: true,
    }),
  });
  counter = new FormControl<Nullable<Counter>>(null, {
    asyncValidators: this.validationService.counter,
  });

  remainingInPercent = computed(() => {
    return (this.portionInput().remainingInGrams / this.portionInput().sizeInGrams) * 100;
  });
  isPortionLoading = computed(() => this.portionsStore.isPortionLoading(this.portionInput().id));
  errors = computed(() => this.portionsStore.getPortionErrors(this.portionInput().id));

  readonly foodSizeOptions = FOOD_UNITS;

  constructor() {
    effect(() => {
      const portion_ = this.portionInput();
      const variations_ = this.variationsStore.variations()!;

      untracked(() => {
        const {
          variation,
          dateAdded,
          dateExpiring,
          portionSizeValue,
          portionSizeUnit,
          remainingValue,
          remainingUnit,
        } = portionToPortionModel(portion_, variations_);

        this.counter.setValue(portion_.counter);

        this.portionForm.controls.variation.setValue(variation);
        this.portionForm.controls.dateAdded.setValue(dateAdded);
        this.portionForm.controls.dateExpiring.setValue(dateExpiring);
        this.portionForm.controls.portionSizeValue.setValue(portionSizeValue);
        this.portionForm.controls.portionSizeUnit.setValue(portionSizeUnit);
        this.portionForm.controls.remainingValue.setValue(remainingValue);
        this.portionForm.controls.remainingUnit.setValue(remainingUnit);
      });
    });

    effect(() => {
      const errors_ = this.errors();

      untracked(() => {
        if (errors_) {
          this.portionForm.controls.dateExpiring.setErrors(errors_.dateExpiring);
          this.portionForm.controls.dateExpiring.markAsTouched();
        }
      });
    });
  }

  async handleEmojiPick(counter: Portion['counter']) {
    this.counter.setValue(counter);

    const variationUpdate = await this.validationService.variationUpdate({
      counter: this.counter.value,
    });

    this.fridgeService.updateVariation(variationUpdate, this.portionInput().variationId);
  }

  async handleChange() {
    const portionModel = await this.validationService.portionModel(this.portionForm.value);
    const portionUpdate = portionModelToPortionUpdate(portionModel);

    this.fridgeService.updatePortion(this.portionInput().id, portionUpdate);
  }

  @HostBinding('class')
  hostClass = 'cid-portion';

  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');
}
