import { CURRENCY, LOCALE } from "../constants/APP";

export const formatPrice = (value) =>
  Number(value ?? 0).toLocaleString(LOCALE, {
    style: "currency",
    currency: CURRENCY,
  });
