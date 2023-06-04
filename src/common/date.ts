import { DateTime } from "luxon";

export function parseEET(timestamp: string) {
  return DateTime.fromISO(timestamp, { locale: "fi", zone: "Europe/Helsinki" });
}
