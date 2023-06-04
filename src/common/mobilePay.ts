import { centsToFloatEur } from "./money";

export function generateMobilePayAppLink({ phone, amount }: { phone: string; amount: number }) {
  const formattedPhone = phone.replace(/\s/g, "");
  const formattedAmount = (centsToFloatEur(amount) ?? 0).toFixed(2);
  return `mobilepayfi://send?phone=${formattedPhone}&amount=${formattedAmount}`;
}

export function generateMobilePayWebLink({ phone, amount }: { phone: string; amount: number }) {
  const formattedPhone = phone.replace(/\s/g, "").replace("+358", "0");
  const formattedAmount = (centsToFloatEur(amount) ?? 0).toFixed(2);
  return `https://www.mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=${formattedPhone}&amount=${formattedAmount}`;
}
