import {
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  CiuiButton,
  CiuiCheckbox,
  CiuiContextMenu,
  CiuiContextMenuTrigger,
  CiuiLoader,
  CiuiNumberInput,
} from '@curseit/ciui';

import { FridgeService } from '../../fridge.service';
import { FoodStore } from '../../store/food.store';
import { PortionsStore } from '../../store/portions.store';
import { VariationsStore } from '../../store/variations.store';
import { Portion, Portions } from '../../types/external/portion.types';
import { VariationAbridged } from '../../types/external/variation.types';
import { CidPortion } from '../portion/portion';

import { PortionsValidationService } from './validation/portions-validation.service';
import { PortionsUsedInRecipeProjectStore } from '@/shared/store/portions-used-in-recipe-project.store';

const DEFAULT_PORTIONS_NUMBER = 1;

@Component({
  selector: 'cid-portions',
  imports: [
    ReactiveFormsModule,
    CiuiButton,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiLoader,
    CiuiNumberInput,
    CidPortion,
  ],
  templateUrl: './portions.html',
  styleUrl: './portions.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortions {
  fridgeService = inject(FridgeService);
  foodStore = inject(FoodStore);
  portionsStore = inject(PortionsStore);
  variationsStore = inject(VariationsStore);
  validationService = inject(PortionsValidationService);
  portionsUsedInRecipeProjectStore = inject(PortionsUsedInRecipeProjectStore);

  createPortionsCount = new FormControl(DEFAULT_PORTIONS_NUMBER, {
    asyncValidators: this.validationService.createPortionsCount,
    nonNullable: true,
  });

  selectedPortions = signal<Portions>([]);
  isAdding = signal(false);
  isRemoving = signal(false);
  isAddingToCooking = signal(false);

  loading = computed(() => {
    return this.portionsStore.loading() || this.variationsStore.loading();
  });
  areAllSelected = computed(() => {
    const portions_ = this.portionsStore.portions();
    const selectedPortions_ = this.selectedPortions();
    return portions_ ? portions_.every(portion => selectedPortions_.includes(portion)) : false;
  });
  isCooking = computed(() => {
    return Boolean(this.portionsUsedInRecipeProjectStore.portionIds()?.length);
  });
  areAllSelectedForCooking = computed(() => {
    const portionIds = this.portionsStore.portions()?.map(({ id }) => id);
    const selectedPortionIds_ = this.portionsUsedInRecipeProjectStore.portionIds();

    return portionIds?.every(id => selectedPortionIds_?.includes(id) ?? true) ?? false;
  });

  isPortionSelectedForCooking(id: Portion['id']) {
    return Boolean(this.portionsUsedInRecipeProjectStore.portionIds()?.includes(id));
  }

  handleAllSelectedChange(value: boolean) {
    const portions_ = this.portionsStore.portions();
    if (!portions_) {
      return;
    }

    if (value) {
      this.selectedPortions.set(portions_);
    } else {
      this.selectedPortions.set([]);
    }
  }

  handleAllSelectedForCookingChange(value: boolean) {
    const portions_ = this.portionsStore.portions();
    const portionUsedIds_ = this.portionsUsedInRecipeProjectStore.portionIds();
    if (!portions_ || !portionUsedIds_) {
      return;
    }

    if (value) {
      const portionsNotSelected = this.portionsStore.getPortionsExcludingIds(portionUsedIds_);

      if (portionsNotSelected.length) {
        this.fridgeService.assignPortionsForCooking(portionsNotSelected);
      }
    } else {
      const portionsSelected = this.portionsStore.getPortionsByIds(portionUsedIds_);

      if (portionsSelected.length) {
        this.fridgeService.discardPortionsFromCooking(portionsSelected);
      }
    }
  }

  toggleSelect(portion: Portion) {
    const selectedPortions_ = this.selectedPortions();
    if (selectedPortions_.includes(portion)) {
      this.selectedPortions.set(
        selectedPortions_.filter(selectedPortion => selectedPortion !== portion),
      );
    } else {
      this.selectedPortions.set([...selectedPortions_, portion]);
    }
  }

  toggleSelectForCooking(portion: Portion) {
    if (this.portionsUsedInRecipeProjectStore.portionIds()?.includes(portion.id)) {
      this.fridgeService.discardPortionsFromCooking([portion]);
    } else {
      this.fridgeService.assignPortionsForCooking([portion]);
    }
  }

  async handleAdd(variation: VariationAbridged) {
    if (!this.createPortionsCount.valid) {
      return;
    }

    this.isAdding.set(true);
    this._contextMenuRef()?.toggle(false);

    await this.fridgeService.addPortions(variation.id, this.createPortionsCount.value);

    this.createPortionsCount.setValue(DEFAULT_PORTIONS_NUMBER);
    this.isAdding.set(false);
  }

  async handleCopy() {
    const selectedPortions_ = this.selectedPortions();
    if (!selectedPortions_.length) {
      return;
    }

    this.isAdding.set(true);

    await this.fridgeService.createPortions(selectedPortions_);

    this.isAdding.set(false);
  }

  async handleCook() {
    const selectedPortions_ = this.selectedPortions();
    if (!selectedPortions_.length) {
      return;
    }

    this.isAddingToCooking.set(true);

    await this.fridgeService.assignPortionsForCooking(this.selectedPortions());

    this.selectedPortions.set([]);
    this.isAddingToCooking.set(false);
  }

  handleEat() {
    // TODO: waiting for dashboard module
  }

  async handleRemove() {
    const selectedPortions_ = this.selectedPortions();
    if (!selectedPortions_.length) {
      return;
    }

    this.isRemoving.set(true);

    await this.fridgeService.removePortions(selectedPortions_.map(({ id }) => id));

    this.selectedPortions.set([]);
    this.isRemoving.set(false);
  }

  @HostBinding('class')
  get hostClasses() {
    return `cid-portions ${this.isCooking() ? 'cid-portions--cooking': ''}`;
  }

  private _contextMenuRef = viewChild<CiuiContextMenu>('contextMenu');
}
