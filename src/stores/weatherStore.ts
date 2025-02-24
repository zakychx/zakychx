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
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: import.meta.env.VITE_WEATHER_API_KEY,
            units: 'metric',
            lang: 'ru'
          }
        });
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