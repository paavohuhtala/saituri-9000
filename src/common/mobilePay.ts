import { centsToFloatEur } from "./money";

export function generateMobilePayAppLink({ phone, amount }: { phone: string; amount: number }) {
  const formattedPhone = transformPhoneNumber(phone);
  const formattedAmount = (centsToFloatEur(amount) ?? 0).toFixed(2);
  return `mobilepayfi://send?phone=${formattedPhone}&amount=${formattedAmount}`;
}

export function generateMobilePayWebLink({ phone, amount }: { phone: string; amount: number }) {
  const formattedPhone = transformPhoneNumber(phone);
  const formattedAmount = (centsToFloatEur(amount) ?? 0).toFixed(2);
  return `https://www.mobilepay.fi/Yrityksille/Maksulinkki/maksulinkki-vastaus?phone=${formattedPhone}&amount=${formattedAmount}`;
}

function transformPhoneNumber(phone: string) {
  return phone.replace(/\s/g, "").replace("+358", "0");
}
