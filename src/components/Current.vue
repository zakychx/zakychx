<template>
  <div class="converter-container">
    <div class="currency-converter">
      <h2>Конвертер валют</h2>
      <div v-if="!currencyStore.isLoading">
        <div class="input-group">
          <label for="amount">Сумма в KGS:</label>
          <input
            type="text"
            id="amount"
            v-model="amount"
            placeholder="Введите сумму в KGS"
            maxlength="9"
            @input="validateInput"
            class="amount-input"
          />
          <p v-if="inputError" class="error-message">Пожалуйста, не пишите буквы.</p>
        </div>

        <div class="select-group">
          <label for="currency">Конвертировать в:</label>
          <select v-model="selectedCurrency" id="currency" class="currency-select">
            <option v-for="(currencyName, currencyCode) in currencyStore.currencies" 
                    :key="currencyCode" 
                    :value="currencyCode">
              {{ currencyCode }} ({{ currencyName }})
            </option>
          </select>
        </div>

        <button 
          @click="convertCurrency" 
          :disabled="!amount || inputError || !currencyStore.rates[selectedCurrency]">
          Конвертировать
        </button>

        <p v-if="convertedAmount !== null" class="conversion-result">
          {{ amount }} KGS = {{ convertedAmount }} {{ selectedCurrency }}
        </p>
      </div>
      
      <div v-else class="loading">
        <img src="../img/loading.gif" alt="Загрузка..." />
      </div>

      <div v-if="currencyStore.error" class="error-bar">
        <p>{{ currencyStore.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCurrencyStore } from '../stores/currencyStore';

const currencyStore = useCurrencyStore();

const amount = ref('');
const selectedCurrency = ref('USD');
const convertedAmount = ref<string | null>(null);
const inputError = ref(false);

function validateInput() {
  const regex = /^[0-9]+$/;
  if (!regex.test(amount.value)) {
    inputError.value = true;
    amount.value = amount.value.replace(/[^\d]/g, '');
  } else {
    inputError.value = false;
  }
}

function convertCurrency() {
  if (amount.value && currencyStore.rates[selectedCurrency.value]) {
    const result = parseFloat(amount.value) * currencyStore.rates[selectedCurrency.value];
    convertedAmount.value = result.toFixed(2);
  } else {
    convertedAmount.value = null;
  }
}
</script>

<style scoped>

.converter-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.currency-converter {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.input-group,
.select-group {
  margin-bottom: 15px;
}

.currency-select {
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

button:hover:not(:disabled) {
  background-color: #369d6b;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.conversion-result {
  font-size: 18px;
  margin-top: 15px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading img {
  width: 50px;
  height: 50px;
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