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
    isLoading: false
  }),

  actions: {
    async fetchWeather(latitude: number, longitude: number) {
      this.isLoading = true;
      this.error = null;

      try {
        const weatherApiKey = 'ff17eb87159b2aabbe6f6a472ea94907';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric&lang=ru`;
        const response = await axios.get(url);
        this.weather = response.data;
      } catch (err) {
        console.error('Ошибка при получении данных о погоде:', err);
        this.weather = null;
        this.error = 'Не удалось загрузить данные о погоде. Попробуйте позже.';
      } finally {
        this.isLoading = false;
      }
    },

    resetWeather() {
      this.weather = null;
      this.error = null;
      this.isLoading = false;
    }
  },
});