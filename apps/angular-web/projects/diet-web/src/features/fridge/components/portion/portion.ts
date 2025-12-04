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

import { portionInputToPortionUpdate } from './transformers/portion-input-to-portion-update';
import { portionToPortionInput } from './transformers/portion-to-portion-input';
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

  portion = input.required<Portion>();
  selected = input(false);

  selectToggled = output();

  portionInput = new FormGroup({
    variation: new FormControl<Nullable<VariationAbridged>>(null),
    dateAdded: new FormControl<Date>(new Date(), { nonNullable: true }),
    dateExpiring: new FormControl<Nullable<Date>>(null),
    portionSize: new FormControl<PortionSize>([100, UNITS.GRAM], {
      asyncValidators: this.validationService.portionSize,
      nonNullable: true,
    }),
  });
  counter = new FormControl<Nullable<Counter>>(null, {
    asyncValidators: this.validationService.counter,
  });

  // TODO: remove when `base-input` supports no form control
  selectedControl = new FormControl(false);

  isPortionLoading = computed(() => this.portionsStore.loading() === this.portion().id);

  readonly portionSizeOptions = FOOD_UNITS;

  constructor() {
    effect(() => {
      const portion_ = this.portion();
      const variations_ = this.variationsStore.variations()!;

      untracked(() => {
        const { variation, dateAdded, dateExpiring, portionSize } = portionToPortionInput(
          portion_,
          variations_,
        );

        this.counter.setValue(portion_.counter);

        this.portionInput.controls.variation.setValue(variation);
        this.portionInput.controls.dateAdded.setValue(dateAdded);
        this.portionInput.controls.dateExpiring.setValue(dateExpiring);
        this.portionInput.controls.portionSize.setValue(portionSize);
      });
    });
  }

  async handleEmojiPick(counter: Portion['counter']) {
    this.counter.setValue(counter);

    const variationUpdate = await this.validationService.variationUpdate({
      counter: this.counter.value,
    });

    this.fridgeService.updateVariation(variationUpdate, this.portion().variationId);
  }

  async handleChange() {
    const portionInput = await this.validationService.portionInput(this.portionInput.value);

    const update = portionInputToPortionUpdate(portionInput);

    this.fridgeService.updatePortion(this.portion().id, update);
  }

  @HostBinding('class')
  hostClass = 'cid-portion';

  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');
}
