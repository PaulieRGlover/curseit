import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { zodValidateForFormControl } from '@/core/validation/zod-validate-for-form-control.util';

@Injectable({ providedIn: 'root' })
export class EmojiValidationService {
  public async emojiSymbol(control: AbstractControl) {
    const schema = (await import('../types/emoji.types')).emojiSymbol;
    return zodValidateForFormControl(schema, control);
  }
}
