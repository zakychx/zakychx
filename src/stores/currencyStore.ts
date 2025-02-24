import { defineStore } from 'pinia';
import axios from 'axios';

interface Rates {
  [key: string]: number;
}

interface Currencies {
  [key: string]: string;
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    rates: {} as Rates,
    currencies: {} as Currencies,
    error: null as string | null,
    isLoading: false
  }),

  actions: {
    async fetchRates() {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_CURRENCY_API_KEY}/latest/KGS`);
        if (response.data && response.data.conversion_rates) {
          this.rates = response.data.conversion_rates;
          this.error = null;
        }
      } catch (err) {
        console.error('Ошибка при загрузке курсов валют:', err);
        this.rates = {};
        this.error = 'Не удалось загрузить курсы валют. Попробуйте позже.';
      }
    },

    async fetchCurrencies() {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_CURRENCY_API_KEY}/codes`);
        if (response.data && response.data.supported_codes) {
          const currencies: Currencies = {};
          response.data.supported_codes.forEach((item: string[]) => {
            if (item.length === 2) {
              currencies[item[0]] = item[1];
            }
          });
          this.currencies = currencies;
          this.error = null;
        }
      } catch (err) {
        console.error('Ошибка при загрузке списка валют:', err);
        this.currencies = {};
        this.error = 'Не удалось загрузить список валют. Попробуйте позже.';
      }
    }
  }
});