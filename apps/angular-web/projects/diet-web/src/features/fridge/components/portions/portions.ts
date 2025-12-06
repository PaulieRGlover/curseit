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
  CiuiInput,
  CiuiLoader,
} from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { RouterService } from '@/core/router/router.service';
import { ROUTES } from '@/core/router/routes';

import { FridgeService } from '../../fridge.service';
import { PortionsStore } from '../../store/portions.store';
import { VariationsStore } from '../../store/variations.store';
import { Portion, Portions } from '../../types/external/portion.types';
import { VariationAbridged } from '../../types/external/variation.types';
import { CidPortion } from '../portion/portion';

import { PortionsValidationService } from './validation/portions-validation.service';

const DEFAULT_PORTIONS_NUMBER = 1;

@Component({
  selector: 'cid-portions',
  imports: [
    ReactiveFormsModule,
    CiuiButton,
    CiuiCheckbox,
    CiuiContextMenu,
    CiuiContextMenuTrigger,
    CiuiInput,
    CiuiLoader,
    CidPortion,
  ],
  templateUrl: './portions.html',
  styleUrl: './portions.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidPortions {
  routerService = inject(RouterService);
  fridgeService = inject(FridgeService);
  portionsStore = inject(PortionsStore);
  variationsStore = inject(VariationsStore);
  validationService = inject(PortionsValidationService);

  allSelected = new FormControl(false);
  createPortionsCount = new FormControl(DEFAULT_PORTIONS_NUMBER, {
    asyncValidators: this.validationService.createPortionsCount,
    nonNullable: true,
  });

  isInitialized = signal(false);
  selectedPortions = signal<Portions>([]);
  isAdding = signal(false);
  isRemoving = signal(false);

  foodId = computed<Nullable<string>>(() => {
    const { FOOD } = ROUTES.FRIDGE.FOODS;
    return this.routerService.findInTreeById(FOOD.ROOT.id)?.params?.['foodId'] ?? null;
  });
  loading = computed(() => {
    return this.portionsStore.loading() || this.variationsStore.loading() || !this.isInitialized();
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
    if (!this.createPortionsCount.valid) {
      return;
    }

    this.isAdding.set(true);
    this._contextMenuRef()?.toggle(false);

    const foodId_ = this.foodId();
    if (!foodId_) {
      throw new Error('no food id');
    }

    await this.fridgeService.addPortions(variation.id, this.createPortionsCount.value);

    this.createPortionsCount.setValue(DEFAULT_PORTIONS_NUMBER);
    this.isAdding.set(false);
  }

  handleCopy() {}

  handleCook() {
    // TODO: waiting for kitchen module
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

    await this.fridgeService.deletePortions(selectedPortions_.map(({ id }) => id));

    this.selectedPortions.set([]);
    this.isRemoving.set(false);
  }

  @HostBinding('class')
  hostClass = 'cid-portions';

  private _contextMenuRef = viewChild<CiuiContextMenu>('contextMenu');
}
