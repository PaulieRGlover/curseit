import {
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  CiuiCheckbox,
  CiuiContextMenu,
  CiuiContextMenuTrigger,
  CiuiIcon,
  CiuiInputSelect,
  CiuiLoader,
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { ENERGY, ENERGY_ARRAY, UNITS, convertToKj } from '@curseit/units';

import { FridgeService } from '../fridge.service';
import { CidPortion } from '../portion/portion';
import { VariationNutrientsStore } from '../store/variation-nutrients.store';
import { VariationStore } from '../store/variation.store';
import { CidVariationNutrients } from '../variation-nutrients/variation-nutrients';

import { CidEmojiPicker } from './emoji-picker/emoji-picker';
import { variationInputUpdateToVariationUpdate } from './transformers/variation-input-to-variation-update.transformer';
import { variationToVariationInput } from './transformers/variation-to-variation-input.transformer';
import { Energy, PortionSize, ReferenceSize, VariationInput } from './types/variation-input.types';
import { VariationValidationService } from './validation/variation-validation.service';

@Component({
  selector: 'cid-variation',
  imports: [
    ReactiveFormsModule,
    CiuiCheckbox,
    CiuiInputSelect,
    CiuiLoader,
    CiuiIcon,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CidVariationNutrients,
    CidPortion,
    CidEmojiPicker,
  ],
  templateUrl: './variation.html',
  styleUrl: './variation.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidVariation {
  variationStore = inject(VariationStore);
  variationNutrientsStore = inject(VariationNutrientsStore);
  fridgeService = inject(FridgeService);
  validationService = inject(VariationValidationService);

  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');

  variationInput = computed<Nullable<VariationInput>>(() => {
    const variation = this.variationStore.variation();
    if (!variation) {
      return null;
    }

    return variationToVariationInput(variation);
  });

  energyCalculated = computed<Nullable<Energy>>(() => {
    const variation = this.variationStore.variation();
    if (!variation) {
      return null;
    }

    const energyCalculatedKcal = this.variationNutrientsStore.energyCalculatedKcal();
    const { energyDisplayUnit } = variation;
    return [
      energyDisplayUnit === 'kJ' ? convertToKj(energyCalculatedKcal) : energyCalculatedKcal,
      energyDisplayUnit,
    ];
  });

  referenceSize = new FormControl<ReferenceSize>([100, UNITS.GRAM], {
    asyncValidators: this.validationService.referenceSize,
  });
  energy = new FormControl<Energy>([100, ENERGY.KILOCALORIE], {
    asyncValidators: this.validationService.energy,
  });
  energyAuto = new FormControl(true, { nonNullable: true });
  portionSize = new FormControl<PortionSize>([100, UNITS.GRAM], {
    asyncValidators: this.validationService.portionSize,
  });
  counter = new FormControl('🥫', { nonNullable: true });

  readonly referenceSizeOptions = [UNITS.GRAM, UNITS.KILOGRAM, UNITS.OUNCE, UNITS.POUND];
  readonly energyOptions = [...ENERGY_ARRAY];
  readonly portionSizeOptions = [UNITS.GRAM, UNITS.KILOGRAM, UNITS.OUNCE, UNITS.POUND];

  constructor() {
    effect(() => {
      const variationInput = this.variationInput();
      const energyCalculated = this.energyCalculated();

      untracked(() => {
        if (!variationInput) {
          return;
        }

        const { referenceSize, energy, energyAuto, portionSize, counter } = variationInput;

        this.referenceSize.setValue(referenceSize);
        if (energyAuto) {
          this.energy.setValue(energyCalculated);
        } else {
          this.energy.setValue(energy);
        }
        this.energyAuto.setValue(energyAuto);
        this.portionSize.setValue(portionSize);
        this.counter.setValue(counter);
      });
    });

    effect(() => {
      const energyAuto = this.variationStore.energyAuto();

      untracked(() => {
        if (energyAuto ?? true) {
          this.energy.setValue(this.energyCalculated());
          this.energy.disable({ emitEvent: true });
        } else {
          const { energy = [0, ENERGY.KILOCALORIE] } = this.variationInput() ?? {};
          this.energy.setValue(energy);
          this.energy.enable({ emitEvent: true });
        }
      });
    });
  }

  handleEmojiPick(emoji: string) {
    this.counter.setValue(emoji);
    this.handleChange();
    this._contextMenuRef().toggle(false);
  }

  async handleChange(updateEnergy = true) {
    const variationInput = await this.validationService.variationInputUpdate({
      referenceSize: this.referenceSize.value,
      energy: updateEnergy ? this.energy.value : undefined,
      energyAuto: this.energyAuto.value,
      portionSize: this.portionSize.value,
      counter: this.counter.value,
    });

    this.fridgeService.updateVariation(variationInputUpdateToVariationUpdate(variationInput));
  }

  @HostBinding('class')
  hostClass = 'cid-food-variation';
}
