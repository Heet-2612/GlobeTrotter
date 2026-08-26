import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import {
  formatCurrency,
  convertCurrency,
  formatDualCurrency,
  SUPPORTED_CURRENCIES,
  CurrencyItem,
} from '../utils/currency';

interface CurrencyContextType {
  displayCurrency: string;
  setDisplayCurrency: (code: string) => void;
  rates: Record<string, number>;
  isLiveRates: boolean;
  supportedCurrencies: CurrencyItem[];
  formatDual: (amount: number | null | undefined, localCurrency?: string, customLocalSymbol?: string) => string;
  convert: (amount: number | null | undefined, fromCode: string, toCode?: string) => number;
  formatDisplay: (amount: number | null | undefined, fromCode: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'globetrotter_display_currency';

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [displayCurrency, setDisplayCurrencyState] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || 'INR';
  });

  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1.0,
    INR: 86.5,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 152.3,
  });

  const [isLiveRates, setIsLiveRates] = useState<boolean>(true);

  useEffect(() => {
    fetchRates();
  }, []);

  // Sync user profile preferred currency when user logs in
  useEffect(() => {
    if (user && user.preferredCurrency) {
      const savedInStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!savedInStorage) {
        setDisplayCurrencyState(user.preferredCurrency.toUpperCase());
        localStorage.setItem(LOCAL_STORAGE_KEY, user.preferredCurrency.toUpperCase());
      }
    }
  }, [user]);

  const fetchRates = async () => {
    try {
      const data = await api.getExchangeRates();
      if (data && data.rates) {
        setRates(data.rates);
        setIsLiveRates(data.live !== false);
      }
    } catch (err) {
      console.warn('Failed to fetch live exchange rates from backend:', err);
      setIsLiveRates(false);
    }
  };

  const setDisplayCurrency = (code: string) => {
    const uppercaseCode = code.toUpperCase();
    setDisplayCurrencyState(uppercaseCode);
    localStorage.setItem(LOCAL_STORAGE_KEY, uppercaseCode);
  };

  const formatDual = (amount: number | null | undefined, localCurrency: string = 'INR', customLocalSymbol?: string) => {
    return formatDualCurrency(amount, localCurrency, displayCurrency, rates, customLocalSymbol);
  };

  const convert = (amount: number | null | undefined, fromCode: string, toCode?: string) => {
    const targetCode = toCode || displayCurrency;
    return convertCurrency(amount, fromCode, targetCode, rates);
  };

  const formatDisplay = (amount: number | null | undefined, fromCode: string) => {
    const converted = convert(amount, fromCode, displayCurrency);
    return formatCurrency(converted, displayCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        displayCurrency,
        setDisplayCurrency,
        rates,
        isLiveRates,
        supportedCurrencies: SUPPORTED_CURRENCIES,
        formatDual,
        convert,
        formatDisplay,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
