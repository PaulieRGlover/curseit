module.exports = {
  arrowParens: 'avoid',
  decorators: true,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-css-order'],
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  importOrder: [
    '^@nestjs/(.*)$',
    '^@(?!(\\/|curseit))(.*)$',
    '^\\w(.*)$',
    '^@curseit/(.*)$',
    '^@/(.*)$',
    '\\.\\./(.*)$',
    '\\./(.*)$'
  ],
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
