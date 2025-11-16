export const CONTEXT_MENU_ERRORS = {
  NO_MENU: 'No menu found. Check that the <ciui-context-menu /> component is next to the element with the trigger directive or that they both have relevant `menuId` provided.',
  NO_TRIGGER: 'No trigger found. Check that the <ciui-context-menu /> component is next to the element with the trigger directive or that they both have relevant `menuId` provided.',
  NO_WRAPPER_FOR_TRIGGER: 'When destroying trigger element, no context menu wrapper was found',
  NO_WRAPPER_FOR_MENU: 'When destroying menu element, no context menu wrapper was found',
} as const;

export const DIALOG_ERRORS = {
  NO_DIALOG: 'No dialog found. Check that the <ciui-context-menu /> component and the element with the directive both have relevant `menuId` provided.',
} as const;
