import ms from 'ms';

const msRegExp = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/; // taken straight from ms since they didn't bother to mark it for exports or provide any way to properly type-check

export const isMsStringValue = (input: unknown): input is ms.StringValue => {
  return typeof input === 'string' && Boolean(msRegExp.test(input));
};
