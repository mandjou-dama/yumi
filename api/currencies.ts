const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

interface AllCurrenciesResponse {
  base: string;
  results: Results;
  updated: string;
  ms: number;
}

interface Results {
  AED: number;
  AFN: number;
  ALL: number;
  AMD: number;
  ANG: number;
  AOA: number;
  ARS: number;
  AUD: number;
  AWG: number;
  AZN: number;
  BAM: number;
  BBD: number;
  BDT: number;
  BGN: number;
  BHD: number;
  BIF: number;
  BMD: number;
  BND: number;
  BOB: number;
  BRL: number;
  BSD: number;
  BTN: number;
  BWP: number;
  BZD: number;
  CAD: number;
  CDF: number;
  CHF: number;
  CLF: number;
  CLP: number;
  CNH: number;
  CNY: number;
  COP: number;
  CUP: number;
  CVE: number;
  CZK: number;
  DJF: number;
  DKK: number;
  DOP: number;
  DZD: number;
  EGP: number;
  ERN: number;
  ETB: number;
  EUR: number;
  FJD: number;
  FKP: number;
  GBP: number;
  GEL: number;
  GHS: number;
  GIP: number;
  GMD: number;
  GNF: number;
  GTQ: number;
  GYD: number;
  HKD: number;
  HNL: number;
  HRK: number;
  HTG: number;
  HUF: number;
  IDR: number;
  ILS: number;
  INR: number;
  IQD: number;
  IRR: number;
  ISK: number;
  JMD: number;
  JOD: number;
  JPY: number;
  KES: number;
  KGS: number;
  KHR: number;
  KMF: number;
  KPW: number;
  KRW: number;
  KWD: number;
  KYD: number;
  KZT: number;
  LAK: number;
  LBP: number;
  LKR: number;
  LRD: number;
  LSL: number;
  LYD: number;
  MAD: number;
  MDL: number;
  MGA: number;
  MKD: number;
  MMK: number;
  MNT: number;
  MOP: number;
  MRU: number;
  MUR: number;
  MVR: number;
  MWK: number;
  MXN: number;
  MYR: number;
  MZN: number;
  NAD: number;
  NGN: number;
  NOK: number;
  NPR: number;
  NZD: number;
  OMR: number;
  PAB: number;
  PEN: number;
  PGK: number;
  PHP: number;
  PKR: number;
  PLN: number;
  PYG: number;
  QAR: number;
  RON: number;
  RSD: number;
  RUB: number;
  RWF: number;
  SAR: number;
  SCR: number;
  SDG: number;
  SEK: number;
  SGD: number;
  SHP: number;
  SLL: number;
  SOS: number;
  SRD: number;
  SYP: number;
  SZL: number;
  THB: number;
  TJS: number;
  TMT: number;
  TND: number;
  TOP: number;
  TRY: number;
  TTD: number;
  TWD: number;
  TZS: number;
  UAH: number;
  UGX: number;
  USD: number;
  UYU: number;
  UZS: number;
  VND: number;
  VUV: number;
  WST: number;
  XAF: number;
  XCD: number;
  XDR: number;
  XOF: number;
  XPF: number;
  YER: number;
  ZAR: number;
  ZMW: number;
}

export const fetchExchangeRates = async (baseCurrency: string) => {
  const response = await fetch(
    `${API_URL}/fetch-all?from=${baseCurrency}&api_key=${API_KEY}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await response.json();
  return data;
};

export const fetchTimeSeries = async (
  baseCurrency: string,
  targetCurrency: string,
  startDate: string,
  endDate: string,
  interval: string
) => {
  const response = await fetch(
    `${API_URL}/time-series?from=${baseCurrency}&to=${targetCurrency}&start=${startDate}&end=${endDate}&interval=${interval}&api_key=${API_KEY}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch time series");
  }

  const data = await response.json();
  return data;
};
