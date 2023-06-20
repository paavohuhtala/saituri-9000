import { isTest } from "./config";

/**
 * On development and production environments passes the provided number through without modification.
 * If the environment is test, returns 1 millisecond.
 */
export function delayMs(time: number): number {
  if (isTest) {
    return 1;
  }

  return time;
}
