<template>
  <div class="weather-container">
    <div v-if="weatherStore.weather">
      <div class="weather-card">
        <h2>Погода в вашем местоположении</h2>
        <div class="weather-info">
          <p><strong>Температура:</strong> {{ weatherStore.weather.main.temp }} °C</p>
          <p><strong>Условие:</strong> {{ weatherStore.weather.weather[0].description }}</p>
          <p><strong>Город:</strong> {{ weatherStore.weather.name }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="weatherStore.isLoading" class="loading">
      <img src="../img/loading.gif" alt="Загрузка..." />
    </div>
    <div v-if="weatherStore.error && !weatherStore.weather" class="error-bar">
      <p>{{ weatherStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useWeatherStore } from '../stores/weatherStore';

const weatherStore = useWeatherStore();

function getWeatherData() {
  if (!weatherStore.weather && !weatherStore.isLoading) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        weatherStore.fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error("Ошибка при получении геолокации:", error);
        weatherStore.error = 'Не удалось получить ваше местоположение. Пожалуйста, разрешите доступ к геолокации.';
      }
    );
  }
}

onMounted(() => {
  getWeatherData();
});

onBeforeUnmount(() => {
  weatherStore.resetWeather();
});
</script>

<style scoped>
.weather-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.weather-card {
  background-color: #1e90ff;
  color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.weather-info p {
  font-size: 18px;
  margin: 10px 0;
}

.loading img {
  width: 50px;
  height: 50px;
  margin-top: 50px;
}

.error-bar {
  margin-top: 20px;
  color: rgb(255, 0, 0);
  text-align: center;
  padding: 10px;
  font-size: 16px;
  z-index: 1000;
  border: 1px solid red;
}

</style>