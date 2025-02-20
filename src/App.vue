<template>
    <div id="app" class="app-container">
      <!-- Навигационные кнопки -->
      <div class="nav-buttons">
        <button 
          :class="{ active: state.isWeatherVisible }" 
          @click="showWeather" 
          class="nav-button">
          Погода
        </button>
        <button 
          :class="{ active: !state.isWeatherVisible }" 
          @click="showConverter" 
          class="nav-button">
          Конвертер
        </button>
      </div>
  
      <!-- Блок погоды -->
      <div v-if="state.isWeatherVisible" class="weather-container">
        <!-- Проверяем, есть ли данные о погоде -->
        <div v-if="state.weather">
          <div class="weather-card">
            <h2>Погода в вашем местоположении</h2>
            <div class="weather-info">
              <p><strong>Температура:</strong> {{ state.weather.main.temp }} °C</p>
              <p><strong>Условие:</strong> {{ state.weather.weather[0].description }}</p>
              <p><strong>Город:</strong> {{ state.weather.name }}</p>
            </div>
          </div>
        </div>
  
        <!-- Гифка загрузки, если данные о погоде еще загружаются -->
        <div v-else-if="!state.errorMessage" class="loading">
          <img src="./img/loading.gif" alt="Загрузка..." />
        </div>
  
        <!-- Ошибка при получении погоды -->
        <div v-if="state.errorMessage && !state.weather" class="error-bar">
          <p>{{ state.errorMessage }}</p>
        </div>
      </div>
  
      <!-- Блок конвертера валют -->
      <div v-else class="converter-container">
        <div class="currency-converter">
          <h2>Конвертер валют</h2>
          <div class="input-group">
            <label for="amount">Сумма в KGS:</label>
            <input 
              type="text" 
              id="amount" 
              v-model="state.amount" 
              placeholder="Введите сумму в KGS" 
              maxlength="9"
              @input="validateInput" 
              class="amount-input"
            />
            <p v-if="state.inputError" class="error-message">Пожалуйста, не пишите буквы.</p>
          </div>
  
          <div class="select-group">
            <label for="currency">Конвертировать в:</label>
            <select v-model="state.currency" id="currency" class="currency-select">
              <option v-for="(currencyName, currencyCode) in state.currencies" :key="currencyCode" :value="currencyCode">
                {{ currencyCode }} ({{ currencyName }})
              </option>
            </select>
          </div>
  
          <button @click="convertCurrency">Конвертировать</button>
  
          <p v-if="state.convertedAmount !== null" class="conversion-result">
            {{ state.amount }} KGS = {{ state.convertedAmount }} {{ state.currency }}
          </p>
        </div>
      </div>
  
      <!-- Ошибка в конвертере -->
      <div v-if="state.errorMessage && !state.isWeatherVisible" class="error-bar">
        <p>{{ state.errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  // Интерфейсы для данных о погоде и курсах валют
  interface Weather {
    main: {
      temp: number;
    };
    weather: {
      description: string;
    }[];
    name: string;
  }
  
  interface Rates {
    [key: string]: number;
  }
  
  interface Currencies {
    [key: string]: string;
  }
  
  // Реактивное состояние приложения
  let state = reactive({
    isWeatherVisible: true, // Флаг отображения погоды или конвертера
    weather: null as Weather | null, // Данные о погоде
    amount: '', // Введенная сумма для конвертации
    currency: 'USD', // Выбранная валюта
    convertedAmount: null as string | null, // Результат конвертации
    rates: {} as Rates, // Курсы валют
    currencies: {} as Currencies, // Доступные валюты
    inputError: false, // Ошибка ввода
    errorMessage: null as string | null, // Сообщение об ошибке
  });
  
  // Получаем геолокацию пользователя
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Ошибка при получении геолокации:", error);
          state.errorMessage = 'Не удалось получить ваше местоположение. Пожалуйста, разрешите доступ к геолокации.';
        }
      );
    } else {
      state.errorMessage = 'Геолокация не поддерживается в вашем браузере.';
    }
  }
  
  // Получаем данные о погоде
  function fetchWeather(latitude: number, longitude: number) {
    const weatherApiKey = 'ff17eb87159b2aabbe6f6a472ea94907';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric&lang=ru`;
    axios.get(url)
      .then((response) => {
        state.weather = response.data;
      })
      .catch((error) => {
        console.error('Ошибка при получении данных о погоде:', error);
        state.errorMessage = 'Ошибка получения данных о погоде. Попробуйте позже.';
      });
  }
  
  // Получаем курсы валют
  function fetchRates() {
    const url = `https://v6.exchangerate-api.com/v6/785987889534066071f5cece/latest/KGS`;
    axios.get(url)
      .then((response) => {
        state.rates = response.data.conversion_rates;
      })
      .catch((error) => {
        console.error('Ошибка при получении курсов валют:', error);
        state.errorMessage = 'Ошибка получения курсов валют. Попробуйте позже.';
      });
  }
  
  // Получаем список доступных валют
  function fetchCurrencies() {
    const url = 'https://v6.exchangerate-api.com/v6/785987889534066071f5cece/codes';
    axios.get(url)
      .then((response) => {
        state.currencies = response.data.supported_codes.reduce(
          (acc: Currencies, [code, name]: [string, string]) => {
            acc[code] = name;
            return acc;
          },
          {}
        );
      })
      .catch((error) => {
        console.error('Ошибка при получении списка валют:', error);
        state.errorMessage = 'Ошибка получения списка валют. Попробуйте позже.';
      });
  }
  
  // Конвертируем валюту
  function convertCurrency() {
    if (state.amount && state.rates[state.currency]) {
      state.convertedAmount = (parseFloat(state.amount) * state.rates[state.currency]).toFixed(2);
    } else {
      state.convertedAmount = null;
    }
  }
  
  // Переключение на экран погоды
  function showWeather() {
    state.isWeatherVisible = true;
    state.errorMessage = null;
    getUserLocation();
  }
  
  // Переключение на экран конвертера
  function showConverter() {
    state.isWeatherVisible = false;
    state.errorMessage = null;
  }
  
  // Проверка корректности ввода
  function validateInput() {
    const regex = /^[0-9]+$/;
    if (!regex.test(state.amount)) {
      state.inputError = true;
      state.amount = state.amount.replace(/[^\d]/g, '');
    } else {
      state.inputError = false;
    }
  }
  
  // Выполняем загрузку данных при монтировании компонента
  onMounted(() => {
    getUserLocation();
    fetchRates();
    fetchCurrencies();
  });
  </script>
  
  <style scoped>
  :deep(body) {
  background-color: #138e88;
}

  /* Стили для контейнера приложения */
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
  
  .weather-container,
  .converter-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .weather-card,
  .currency-converter {
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
  }
  
  .weather-card {
    background-color: #1e90ff;
    color: white;
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
  
  .input-group,
  .select-group {
    margin-bottom: 15px;
  }
  
  select {
    padding: 8px;
    font-size: 16px;
    width: 100%;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .amount-input {
    padding: 8px;
    font-size: 16px;
    width: 300px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    text-align: center;
  }
  

  
  button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #369d6b;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .conversion-result {
    font-size: 18px;
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
  h1,h2,h3,h4,h5,p, label{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  </style>
  