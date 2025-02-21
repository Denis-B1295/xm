import {CompanySymbol} from '../types/nasdaq.js';

export const isValidSymbol = (symbol: string, symbols: CompanySymbol[]) => 
  symbols.some((s) => s.Symbol === symbol);

export const getCompanyName = (symbol: string, symbols: CompanySymbol[]) => 
  symbols.find((s) => s.Symbol === symbol)?.['Company Name'];