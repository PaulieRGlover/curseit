export type Size = 'microscopic' | 'tiny' | 'small' | 'medium' | 'big';

export const downscaleSize = (size: Size): Size => {
  switch (size) {
    case 'microscopic': return 'microscopic';
    case 'tiny': return 'microscopic';
    case 'small': return 'tiny';
    case 'medium': return 'small';
    case 'big': return 'medium';
  }
};
