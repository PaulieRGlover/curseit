import { Size, Theme } from '../../shared/constants';

type Options = {
  theme?: Theme;
  size?: Size;
  symmetric?: boolean;
  noShadow?: boolean;
  noBorder?: boolean;
};

export const cardClasses = (options: Options = {}) => {
  const { theme = 'white', size = 'medium', symmetric, noShadow, noBorder } = (options);

  return [
    'ciui-card',
    `ciui-card--theme-${theme}`,
    `ciui-card--size-${size}`,
    symmetric ? 'ciui-card--symmetric' : '',
    noShadow ? 'ciui-card--no-shadow' : '',
    noBorder ? 'ciui-card--no-border' : '',
  ];
};
