export function centsToEurPrice(cents: number): string {
  const price = (cents / 100).toFixed(2).replace(".", ",").replace("-", "− ");

  return `${price} €`;
}

export function centsToFloatEur(cents: number | null | undefined): number | null {
  if (cents === undefined || cents === null) {
    return null;
  }

  return cents / 100;
}

export function floatEurToInputValue(value: number | null | undefined): string {
  if (value === undefined || value === null) {
    return "";
  }

  return value.toFixed(2).replace(".", ",");
}
