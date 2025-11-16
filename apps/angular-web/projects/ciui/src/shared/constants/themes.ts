export type Theme = 'white' | 'white-semi-transparent' | 'white-transparent' | 'dark';

export const invertTheme = (theme: Theme): Theme => {
  switch (theme) {
    case 'white': return 'dark';
    case 'white-transparent': return 'dark';
    case 'white-semi-transparent': return 'dark';
    case 'dark': return 'white';
  }
};

export const reduceTheme = (theme: Theme): Theme => {
    if (['white', 'white-semi-transparent', 'white-transparent'].includes(theme)) {
      return 'white';
    }

    if (theme === 'dark') {
      return 'dark';
    }

    return 'white';
};
