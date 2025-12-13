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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

import { FOOD_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { VariationStore } from '../../store/variation.store';
import { Energy, PortionSize, ReferenceSize } from '../../types/internal/variation.types';
import { CidEmojiPicker } from '../emoji-picker/emoji-picker';
import { CidPortionBadge } from '../portion-badge/portion-badge';
import { CidVariationNutrients } from '../variation-nutrients/variation-nutrients';

import { variationModelUpdateToVariationUpdate } from './transformers/variation-model-update-to-variation-update.transformer';
import { variationToVariationModel } from './transformers/variation-to-variation-model.transformer';
import { VariationModel } from './types/variation.types';
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
    CidPortionBadge,
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

  variationForm = new FormGroup({
    referenceSize: new FormControl<ReferenceSize>([100, UNITS.GRAM], {
      asyncValidators: this.validationService.referenceSize,
    }),
    energy: new FormControl<Energy>([100, ENERGY.KILOCALORIE], {
      asyncValidators: this.validationService.energy,
    }),
    energyAuto: new FormControl(true, { nonNullable: true }),
    portionSize: new FormControl<PortionSize>([100, UNITS.GRAM], {
      asyncValidators: this.validationService.portionSize,
    }),
    counter: new FormControl('🥫', { nonNullable: true }),
  });

  variationModel = computed<Nullable<VariationModel>>(() => {
    const variation = this.variationStore.variation();
    if (!variation) {
      return null;
    }

    return variationToVariationModel(variation);
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

  readonly referenceSizeOptions = FOOD_UNITS;
  readonly energyOptions = [...ENERGY_ARRAY];
  readonly portionSizeOptions = FOOD_UNITS;

  constructor() {
    effect(() => {
      const variationModel_ = this.variationModel();
      const energyCalculated_ = this.energyCalculated();

      untracked(() => {
        if (!variationModel_) {
          return;
        }

        const { referenceSize, energy, energyAuto, portionSize, counter } = variationModel_;

        this.variationForm.controls.referenceSize.setValue(referenceSize);
        if (energyAuto) {
          this.variationForm.controls.energy.setValue(energyCalculated_);
        } else {
          this.variationForm.controls.energy.setValue(energy);
        }
        this.variationForm.controls.energyAuto.setValue(energyAuto);
        this.variationForm.controls.portionSize.setValue(portionSize);
        this.variationForm.controls.counter.setValue(counter);
      });
    });

    effect(() => {
      const energyAuto_ = this.variationStore.energyAuto();

      untracked(() => {
        if (energyAuto_ ?? true) {
          this.variationForm.controls.energy.setValue(this.energyCalculated());
          this.variationForm.controls.energy.disable({ emitEvent: true });
        } else {
          const { energy = [0, ENERGY.KILOCALORIE] } = this.variationModel() ?? {};
          this.variationForm.controls.energy.setValue(energy);
          this.variationForm.controls.energy.enable({ emitEvent: true });
        }
      });
    });
  }

  handleEmojiPick(emoji: string) {
    this.variationForm.controls.counter.setValue(emoji);
    this.handleChange();
    this._contextMenuRef().toggle(false);
  }

  async handleChange(updateEnergy = true) {
    const variationModelUpdate = await this.validationService.variationModelUpdate(
      this.variationForm.value,
    );

    this.fridgeService.updateVariation(
      variationModelUpdateToVariationUpdate(variationModelUpdate, updateEnergy),
    );
  }

  @HostBinding('class')
  hostClass = 'cid-food-variation';

  protected _contextMenuRef = viewChild.required<CiuiContextMenu>('contextMenu');
}
