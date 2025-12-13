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
  CiuiInputSelect,
  CiuiLoader,
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
import { Counter, PortionSize } from '../../types/internal/variation.types';
import { CidEmojiPicker } from '../emoji-picker/emoji-picker';
import { CidPortionBadge } from '../portion-badge/portion-badge';

import { portionModelToPortionUpdate } from './transformers/portion-input-to-portion-update';
import { portionToPortionModel } from './transformers/portion-to-portion-input';
import { Remaining } from './types/portion.types';
import { PortionValidationService } from './validation/portion-validation.service';

@Component({
  selector: 'cid-portion',
  imports: [
    ReactiveFormsModule,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiDateInput,
    CiuiInputSelect,
    CiuiLoader,
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
    portionSize: new FormControl<PortionSize>([100, UNITS.GRAM], {
      asyncValidators: this.validationService.portionSize,
      nonNullable: true,
    }),
    remaining: new FormControl<Remaining>([100, UNITS.GRAM], {
      asyncValidators: this.validationService.remaining,
      nonNullable: true,
    }),
  });
  counter = new FormControl<Nullable<Counter>>(null, {
    asyncValidators: this.validationService.counter,
  });

  // TODO: remove when `base-input` supports no form control
  selectedControl = new FormControl(false);

  remainingInPercent = computed(() => {
    return this.portionInput().remainingInGrams / this.portionInput().sizeInGrams * 100;
  });
  isPortionLoading = computed(() => this.portionsStore.isPortionLoading(this.portionInput().id));
  errors = computed(() => this.portionsStore.getPortionErrors(this.portionInput().id));

  readonly foodSizeOptions = FOOD_UNITS;

  constructor() {
    effect(() => {
      const portion_ = this.portionInput();
      const variations_ = this.variationsStore.variations()!;

      untracked(() => {
        const { variation, dateAdded, dateExpiring, portionSize, remaining } =
          portionToPortionModel(portion_, variations_);

        this.counter.setValue(portion_.counter);

        this.portionForm.controls.variation.setValue(variation);
        this.portionForm.controls.dateAdded.setValue(dateAdded);
        this.portionForm.controls.dateExpiring.setValue(dateExpiring);
        this.portionForm.controls.portionSize.setValue(portionSize);
        this.portionForm.controls.remaining.setValue(remaining);
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

    effect(() => {
      const selected_ = this.selected();

      untracked(() => {
        this.selectedControl.setValue(selected_);
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
