// src/stores/currencyStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
export const useCurrencyStore = defineStore('currency', {
    state: () => ({
        rates: {},
        currencies: {},
        error: null,
    }),
    actions: {
        async fetchRates() {
            const url = `https://v6.exchangerate-api.com/v6/785987889534066071f5cece/latest/KGS`;
            try {
                const response = await axios.get(url);
                this.rates = response.data.conversion_rates;
                this.error = null;
            }
            catch (err) {
                this.rates = {};
                this.error = 'Не удалось загрузить курсы валют. Попробуйте позже.';
            }
        },
        async fetchCurrencies() {
            const url = 'https://v6.exchangerate-api.com/v6/785987889534066071f5cece/codes';
            try {
                const response = await axios.get(url);
                this.currencies = response.data.supported_codes.reduce((acc, [code, name]) => {
                    acc[code] = name;
                    return acc;
                }, {});
                this.error = null;
            }
            catch (err) {
                this.currencies = {};
                this.error = 'Не удалось загрузить список валют. Попробуйте позже.';
            }
        },
    },
});
