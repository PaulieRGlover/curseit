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
  CiuiLoader,
  CiuiNumberInput,
  CiuiSelect,
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';
import { ENERGY, ENERGY_ARRAY, UNITS, convertToKj } from '@curseit/units';

import { FOOD_UNITS } from '../../constants/units';
import { FridgeService } from '../../fridge.service';
import { VariationNutrientsStore } from '../../store/variation-nutrients.store';
import { VariationStore } from '../../store/variation.store';
import {
  EnergyAmount,
  EnergyUnit,
  PortionSizeUnit,
  PortionSizeValue,
  ReferenceSizeUnit,
  ReferenceSizeValue,
} from '../../types/internal/variation.types';
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
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiIcon,
    CiuiLoader,
    CiuiNumberInput,
    CiuiSelect,
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
    referenceSizeValue: new FormControl<ReferenceSizeValue>(100, {
      asyncValidators: this.validationService.referenceSizeValue,
      nonNullable: true,
    }),
    referenceSizeUnit: new FormControl<ReferenceSizeUnit>(UNITS.GRAM, {
      asyncValidators: this.validationService.referenceSizeUnit,
      nonNullable: true,
    }),
    energyAmount: new FormControl<EnergyAmount>(0, {
      asyncValidators: this.validationService.energyAmount,
    }),
    energyUnit: new FormControl<EnergyUnit>(ENERGY.KILOCALORIE, {
      asyncValidators: this.validationService.energyUnit,
    }),
    energyAuto: new FormControl(true, { nonNullable: true }),
    portionSizeValue: new FormControl<PortionSizeValue>(100, {
      asyncValidators: this.validationService.portionSizeValue,
    }),
    portionSizeUnit: new FormControl<PortionSizeUnit>(UNITS.GRAM, {
      asyncValidators: this.validationService.portionSizeUnit,
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
  energyCalculated = computed<Nullable<{ energyAmount: EnergyAmount; energyUnit: EnergyUnit }>>(
    () => {
      const variation = this.variationStore.variation();
      if (!variation) {
        return null;
      }

      const energyCalculatedKcal = this.variationNutrientsStore.energyCalculatedKcal();
      const { energyDisplayUnit } = variation;
      return {
        energyAmount:
          energyDisplayUnit === 'kJ' ? convertToKj(energyCalculatedKcal) : energyCalculatedKcal,
        energyUnit: energyDisplayUnit,
      };
    },
  );

  readonly foodUnits = FOOD_UNITS;
  readonly energyOptions = [...ENERGY_ARRAY];

  constructor() {
    effect(() => {
      const variationModel_ = this.variationModel();
      const energyCalculated_ = this.energyCalculated();

      untracked(() => {
        if (!variationModel_) {
          return;
        }

        const {
          referenceSizeValue,
          referenceSizeUnit,
          energyAmount,
          energyUnit,
          energyAuto,
          portionSizeValue,
          portionSizeUnit,
          counter,
        } = variationModel_;

        this.variationForm.controls.referenceSizeValue.setValue(referenceSizeValue);
        this.variationForm.controls.referenceSizeUnit.setValue(referenceSizeUnit);
        if (energyAuto) {
          this.variationForm.controls.energyAmount.setValue(energyCalculated_?.energyAmount ?? 0);
          this.variationForm.controls.energyUnit.setValue(
            energyCalculated_?.energyUnit ?? ENERGY.KILOCALORIE,
          );
        } else {
          this.variationForm.controls.energyAmount.setValue(energyAmount);
          this.variationForm.controls.energyUnit.setValue(energyUnit);
        }
        this.variationForm.controls.energyAuto.setValue(energyAuto);
        this.variationForm.controls.portionSizeValue.setValue(portionSizeValue);
        this.variationForm.controls.portionSizeUnit.setValue(portionSizeUnit);
        this.variationForm.controls.counter.setValue(counter);
      });
    });

    effect(() => {
      const energyAuto_ = this.variationStore.energyAuto();

      untracked(() => {
        if (energyAuto_ ?? true) {
          const { energyAmount = 0, energyUnit = ENERGY.KILOCALORIE } =
            this.energyCalculated() ?? {};

          this.variationForm.controls.energyAmount.setValue(energyAmount);
          this.variationForm.controls.energyUnit.setValue(energyUnit);
          this.variationForm.controls.energyAmount.disable({ emitEvent: true });
        } else {
          const { energyAmount = 0, energyUnit = ENERGY.KILOCALORIE } = this.variationModel() ?? {};
          this.variationForm.controls.energyAmount.setValue(energyAmount);
          this.variationForm.controls.energyUnit.setValue(energyUnit);
          this.variationForm.controls.energyAmount.enable({ emitEvent: true });
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
