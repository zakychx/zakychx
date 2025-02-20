// src/stores/weatherStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface Weather {
  main: { temp: number };
  weather: { description: string }[];
  name: string;
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: null as Weather | null,
    error: null as string | null,
  }),

  actions: {
    async fetchWeather(latitude: number, longitude: number) {
      const weatherApiKey = 'ff17eb87159b2aabbe6f6a472ea94907';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric&lang=ru`;

      try {
        const response = await axios.get(url);
        this.weather = response.data;
        this.error = null; // Очистить ошибки
      } catch (err) {
        this.weather = null;
        this.error = 'Не удалось загрузить данные о погоде. Попробуйте позже.';
      }
    },
  },
});
