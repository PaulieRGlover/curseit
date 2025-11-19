import {
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { CiuiIcon, CiuiInput } from '@curseit/ciui';
import { Nullable } from '@curseit/types';

import { Emoji } from './types/emoji.types';
import { EmojiValidationService } from './validation/emoji-validation.service';

@Component({
  selector: 'cid-emoji-picker',
  imports: [ReactiveFormsModule, CiuiInput, CiuiIcon],
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CidEmojiPicker {
  private static emojiCache: Nullable<Array<Emoji>> = null;

  element = inject(ElementRef);
  validationService = inject(EmojiValidationService);

  emojis = signal<Array<Emoji>>([]);

  pick = output<Emoji['symbol']>();

  searchControl = new FormControl('', { asyncValidators: this.validationService.emojiSymbol });

  foundEmojis = computed(() => {
    const search = this._searchSignal()?.toLowerCase();
    return search
      ? this.emojis().filter(({ name, slug }) => {
          return name.toLowerCase().match(search) || slug.toLowerCase().match(search);
        })
      : [];
  });
  firstFoundEmoji = computed<Nullable<Emoji>>(() => this.foundEmojis()[0] ?? null);

  async ngOnInit() {
    if (CidEmojiPicker.emojiCache) {
      this.emojis.set(CidEmojiPicker.emojiCache);
      return;
    }

    const emojis: { [key: string]: Pick<Emoji, 'name' | 'slug'> } = (
      await import('./food-emojis.json')
    ).default;

    this.emojis.set(
      Object.keys(emojis).map(key => ({
        symbol: key,
        name: emojis[key].name,
        slug: emojis[key].slug,
      })),
    );

    CidEmojiPicker.emojiCache = this.emojis();
  }

  isEmojiFound(emoji: Emoji) {
    return this.searchControl.value && this.foundEmojis().includes(emoji);
  }

  handleEmojiClick(emoji: Emoji) {
    this.pick.emit(emoji.symbol);
  }

  handleSearchInput() {
    this.searchControl.markAsUntouched({ emitEvent: true });

    const firstFoundEmoji = this.firstFoundEmoji();
    if (!firstFoundEmoji) {
      return;
    }

    const foundEmojiListItem = (this.element.nativeElement as HTMLElement).querySelector(
      `[title="${firstFoundEmoji.name}"]`,
    );
    foundEmojiListItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  handleSearchEnterPress() {
    const firstFoundEmoji = this.firstFoundEmoji();
    if (!firstFoundEmoji) {
      return;
    }

    this.pick.emit(firstFoundEmoji.symbol);
  }

  resetSearch() {
    this.searchControl.setValue('');
    this._searchRef().setFocus();
  }

  handleCheckMarkClick() {
    if (this.searchControl.valid && this.searchControl.value) {
      this.pick.emit(this.searchControl.value);
    }
  }

  @HostBinding('class')
  hostClass = 'cid-emoji-picker';

  private _searchSignal = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });

  private _searchRef = viewChild.required<CiuiInput>('search');
}
