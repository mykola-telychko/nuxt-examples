<template>
    <div>
      <h1>Додати новий продукт</h1>
      <form @submit.prevent="addProduct">
        <div>
          <label for="name">Назва:</label>
          <input type="text" id="name" v-model="newProduct.name" required>
        </div>
        <div>
          <label for="price">Ціна:</label>
          <input type="number" id="price" v-model="newProduct.price" step="0.01" required>
        </div>
        <button type="submit">Додати продукт</button>
        <div v-if="message" class="message">{{ message }}</div>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const newProduct = ref({
    name: '',
    price: null
  });
  const message = ref('');
  const error = ref('');
  
  const addProduct = async () => {
    message.value = '';
    error.value = '';
  
    try {
      const response = await $fetch('/api/products/add', {
        method: 'POST',
        body: newProduct.value,
        // Додаємо обробку статусу відповіді
        onResponse({ request, response, options }) {
          if (response.status >= 200 && response.status < 300) {
            // Успішна відповідь
            return response;
          } else {
            // Неуспішна відповідь, але без помилки fetch
            const error = new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
            error.response = response;
            throw error;
          }
        },
        onResponseError({ request, response, options }) {
          // Помилка на рівні HTTP (наприклад, 4xx або 5xx)
          const error = new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
          error.response = response;
          throw error;
        }
      });
  
      // Якщо запит був успішним (без викидання помилки в onResponse або onResponseError)
      if (response && response.id && response.message) {
        message.value = response.message;
        newProduct.value = { name: '', price: null }; // Очистити форму після успіху
      } else if (response && response.error) {
        error.value = response.error; // Обробка помилки, яку може повернути сервер у JSON
      } else {
        error.value = 'Невідома помилка при додаванні продукту.';
      }
  
    } catch (err) {
      error.value = err.message || 'Сталася помилка при відправці запиту.';
      console.error('Помилка додавання продукту:', err);
      if (err.response) {
        const errorData = await err.response.json().catch(() => null);
        if (errorData && errorData.statusMessage) {
          error.value = errorData.statusMessage;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .message {
    color: green;
    margin-top: 10px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>