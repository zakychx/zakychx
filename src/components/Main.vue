<template>
  <div id="app" class="app-container">
    <div class="nav-buttons">
      <button :class="{ active: isWeatherVisible }" @click="showWeather" class="nav-button">
        Погода
      </button>
      <button :class="{ active: !isWeatherVisible }" @click="showConverter" class="nav-button">
        Конвертер
      </button>
    </div>

    <Weather v-if="isWeatherVisible" />
    <Current v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Weather from '../components/Weather.vue';
import Current from '../components/Current.vue';
import { useWeatherStore } from '../stores/weatherStore';
import { useCurrencyStore } from '../stores/currencyStore';

const isWeatherVisible = ref(true);
const weatherStore = useWeatherStore();
const currencyStore = useCurrencyStore();

onMounted(async () => {
  try {
    await Promise.all([
      currencyStore.fetchRates(),
      currencyStore.fetchCurrencies()
    ]);
  } catch (error) {
    console.error('Ошибка при инициализации данных:', error);
  }
});

function showWeather() {
  isWeatherVisible.value = true;
}

function showConverter() {
  isWeatherVisible.value = false;
}
</script>

<style scoped>
:deep(body) {
  background-color: #138e88;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.nav-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: #369d6b;
}

.nav-button.active {
  background-color: #2c7d57;
}
</style>