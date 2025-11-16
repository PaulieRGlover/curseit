export const wait = (seconds = 0.3) => new Promise(resolve => setTimeout(resolve, seconds * 1000));
