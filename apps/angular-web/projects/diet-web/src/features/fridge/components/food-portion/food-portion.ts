import {
  Component,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  CiuiCheckbox,
  CiuiContextMenu,
  CiuiContextMenuTrigger,
  CiuiDateInput,
  CiuiInput,
  CiuiInputSelect,
  CiuiSelect,
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { UNITS } from '@curseit/units';

import { FOOD_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { VariationsStore } from '../../store/variations.store';
import { Portion } from '../../types/external/portion.types';
import { VariationAbridged } from '../../types/external/variation.types';
import { Counter, PortionSize } from '../../types/internal/variation.types';
import { CidEmojiPicker } from '../emoji-picker/emoji-picker';
import { CidPortionBadge } from '../portion-badge/portion-badge';

import { portionToPortionInput } from './transformers/portion-to-portion-input';
import { FoodPortionValidationService } from './validation/food-portion-validation.service';

@Component({
  selector: 'cid-food-portion',
  imports: [
    ReactiveFormsModule,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiDateInput,
    CiuiInputSelect,
    CiuiSelect,
    CidPortionBadge,
    CidEmojiPicker,
  ],
  templateUrl: './food-portion.html',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodPortion {
  fridgeService = inject(FridgeService);
  variationsStore = inject(VariationsStore);
  validationService = inject(FoodPortionValidationService);

  portion = input.required<Portion>();
  selected = input(false);

  selectToggled = output();

  variation = new FormControl<Nullable<VariationAbridged>>(null);
  counter = new FormControl<Nullable<Counter>>(null);
  dateAdded = new FormControl<Date>(new Date());
  dateExpiring = new FormControl<Nullable<Date>>(null);
  portionSize = new FormControl<PortionSize>([100, UNITS.GRAM], {
    asyncValidators: this.validationService.portionSize,
  });
  // TODO: remove when `base-input` supports no form control
  selectedControl = new FormControl(false);

  readonly portionSizeOptions = FOOD_UNITS;

  constructor() {
    effect(() => {
      const portion_ = this.portion();
      const variations_ = this.variationsStore.variations()!;

      untracked(() => {
        const { variation, counter, dateAdded, dateExpiring, portionSize } = portionToPortionInput(
          portion_,
          variations_,
        );

        this.variation.setValue(variation);

        this.counter.setValue(counter);
        this.dateAdded.setValue(dateAdded);
        this.dateExpiring.setValue(dateExpiring);
        this.portionSize.setValue(portionSize);
      });
    });
  }

  handleEmojiPick(emoji: string) {
    // TODO: validation
  }

  handleChange() {}

  @HostBinding('class')
  hostClass = 'cid-food-portion';

  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');
}
