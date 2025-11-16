export type Size = 'extra-small' | 'small' | 'medium' | 'big';

export const downscaleSize = (size: Size): Size => {
  switch (size) {
    case 'extra-small': return 'extra-small';
    case 'small': return 'extra-small';
    case 'medium': return 'small';
    case 'big': return 'medium';
  }
};
