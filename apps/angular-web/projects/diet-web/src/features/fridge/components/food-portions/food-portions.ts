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
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { RouterService } from '@/core/router/router.service';

import { FridgeService } from '../../fridge.service';
import { PortionsStore } from '../../store/portions.store';
import { VariationsStore } from '../../store/variations.store';
import { Portion, Portions } from '../../types/external/portion.types';
import { CidFoodPortion } from '../food-portion/food-portion';
import { ROUTES } from '@/core/router/routes';
import { VariationAbridged } from '../../types/external/variation.types';

@Component({
  selector: 'cid-food-portions',
  imports: [
    ReactiveFormsModule,
    CiuiButton,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiLoader,
    CidFoodPortion,
  ],
  templateUrl: './food-portions.html',
  styleUrl: './food-portions.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidFoodPortions {
  routerService = inject(RouterService);
  fridgeService = inject(FridgeService);
  portionsStore = inject(PortionsStore);
  variationsStore = inject(VariationsStore);

  allSelected = new FormControl(false);

  isInitialized = signal(false);
  selectedPortions = signal<Portions>([]);

  foodId = computed<Nullable<string>>(() => {
    const { FOOD } = ROUTES.FRIDGE.FOODS;
    return this.routerService.findInTreeById(FOOD.ROOT.id)?.params?.['foodId'] ?? null;
  });
  loading = computed(() => {
    return (
      this.portionsStore.loading() ||
      this.variationsStore.loading() ||
      !this.isInitialized()
    );
  });
  areAllSelected = computed(() => {
    const portions_ = this.portionsStore.portions();
    return portions_
      ? portions_.every(portion => this.selectedPortions().includes(portion))
      : false;
  });

  constructor() {
    effect(() => {
      const isAllSelected_ = this.areAllSelected();

      untracked(() => {
        this.allSelected.setValue(isAllSelected_);
      });
    });

    effect(() => {
      const portions_ = this.portionsStore.portions();

      untracked(() => {
        if (portions_?.length) {
          this.allSelected.enable();
        } else {
          this.allSelected.disable();
        }
      });
    });
  }

  ngOnInit() {
    const foodId_ = this.foodId();
    if (foodId_ && (!this.portionsStore.portions() || !this.variationsStore.variations())) {
      this.fridgeService.loadPortions(foodId_);
      this.fridgeService.loadVariations(foodId_);
    }

    this.isInitialized.set(true);
  }

  handleAllSelectedChange() {
    const portions_ = this.portionsStore.portions();
    if (!portions_) {
      return;
    }

    if (this.allSelected.value) {
      this.selectedPortions.set(portions_);
    } else {
      this.selectedPortions.set([]);
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

  async handleAdd(variation: VariationAbridged) {
    const foodId_ = this.foodId();
    if (!foodId_) {
      throw new Error('no food id');
    }

    await this.fridgeService.createPortion(foodId_, variation.id);

    this._contextMenuRef()?.toggle(false);
  }

  handleCopy() {}

  handleCook() {
    // TODO: waiting for kitchen module
  }

  handleEat() {
    // TODO: waiting for dashboard module
  }

  handleRemove() {}

  @HostBinding('class')
  hostClass = 'cid-food-portions';

  private _contextMenuRef = viewChild<CiuiContextMenu>('contextMenu');
}
