import { Injectable, signal } from '@angular/core';

import { Nullable } from '@curseit/types';

import { CiuiSelect } from './select';

const FOCUSABLE_TAGS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

@Injectable({ providedIn: 'root' })
export class SelectService {
  selects: Set<CiuiSelect<any>> = new Set();
  focusedSelect = signal<Nullable<CiuiSelect<any>>>(null);

  constructor() {
    document.addEventListener('keydown', this._handleKeydown.bind(this));
    document.addEventListener('click', this._handleDocumentClick.bind(this));
    document.addEventListener('focusin', this._handleDocumentFocusin.bind(this));
  }

  register(select: CiuiSelect<any>) {
    this.selects.add(select);
  }

  unregister(select: CiuiSelect<any>) {
    this.selects.delete(select);

    const focusedSelect = this.focusedSelect();
    if (focusedSelect === select) {
      this.unfocus(focusedSelect);
    }
  }

  focus(select: CiuiSelect<any>) {
    const focusedSelect = this.focusedSelect();
    if (focusedSelect !== select) {
      focusedSelect?._unfocus();
      this.focusedSelect.set(select);
      select._focus();
    }
  }

  unfocus(select: CiuiSelect<any>, selectAllowed = true) {
    const focusedSelect = this.focusedSelect();
    if (focusedSelect === select) {
      focusedSelect._unfocus(selectAllowed);
      this.focusedSelect.set(null);
    }
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (!this.focusedSelect()) {
      return;
    }

    switch (event.key) {
      case 'Enter': this._handleEnter(); break;
      case 'ArrowUp': this._handleArrowUp(event); break;
      case 'ArrowDown': this._handleArrowDown(event); break;
      case ' ': this._handleSpace(event); break;
      case 'Escape': this._handleEscape(event); break;
      case 'Tab': this._handleTab(event); break;
    }
  }

  private _handleDocumentClick(event: Event) {
    const focusedSelect = this.focusedSelect();
    if (!focusedSelect || focusedSelect.element.nativeElement.contains(event.target)) {
      return;
    }

    this.unfocus(focusedSelect);
  }

  private _handleDocumentFocusin(event: FocusEvent) {
    const focusedSelect = this.focusedSelect();
    if (
      focusedSelect &&
      event.target instanceof HTMLElement &&
      FOCUSABLE_TAGS.includes(event.target.tagName) &&
      !focusedSelect.element.nativeElement.contains(event.target)
    ) {
      this.unfocus(focusedSelect);
    }
  }

  private _handleEnter() {
    this.focusedSelect()!.handleEnterPress();
  }

  private _handleArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    this.focusedSelect()!.moveFocus(-1);
  }

  private _handleArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    this.focusedSelect()!.moveFocus(1);
  }

  private _handleSpace(event: KeyboardEvent) {
    this.focusedSelect()!.handleSpacePress(event);
  }

  private _handleEscape(event: KeyboardEvent) {
    // prevent possible modal from closing
    event.preventDefault();
    this.focusedSelect()!.handleEscapePress();
  }

  private _handleTab(event: KeyboardEvent) {
    if (!this.focusedSelect()!.element.nativeElement.contains(document.activeElement)) {
      /**
       * if tab happens when none of the internal inputs or buttons are focused
       * e. g. when the user clicks managing elements inside the context menu which
       * results in losing focus
       */
      event.preventDefault(); // do not allow focus the next element in the context

      this.focusedSelect()!._focus(true); // focus the active select instead
    }
  }
}
