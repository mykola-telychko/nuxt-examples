<template>
  <div>
    <h1>Add new product</h1>

    <!-- Форма додавання продукту -->
    <form @submit.prevent="addProduct">
      <div>
        <label for="name">name:</label>
        <input type="text" id="name" v-model="newProduct.name" required>
      </div>
      <div>
        <label for="price">price:</label>
        <input type="number" id="price" v-model="newProduct.price" step="0.01" required>
      </div>
      <button type="submit">add product</button>
      <div v-if="message" class="message">{{ message }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>

    
 <!-- Список існуючих продуктів -->
<div v-if="products.length" style="margin-top: 20px;">
  <h2>Current Products</h2>
  <ul>
    <li v-for="product in products" :key="product.id" style="display: flex; align-items: center; justify-content: space-between; max-width: 400px;">
      <span>{{ product.name }} - ${{ product.price }}</span>
      <button @click="deleteProduct(product.id)" style="color: red; background: none; border: none; cursor: pointer;">✖</button>
    </li>
  </ul>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const newProduct = ref({ name: '', price: null });
const message = ref('');
const error = ref('');
const products = ref([]); // ← зберігає продукти з бази

// Отримати всі продукти з бази
const fetchProducts = async () => {
  try {
    const data = await $fetch('/api/products');
    products.value = data;
  } catch (err) {
    error.value = 'Не вдалося завантажити список продуктів.';
    console.error('Fetch products error:', err);
  }
};

const addProduct = async () => {
  message.value = '';
  error.value = '';

  try {
    const response = await $fetch('/api/products/add', {
      method: 'POST',
      body: newProduct.value,
      onResponse({ response }) {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Server error: ${response.status}`);
        }
      },
      onResponseError({ response }) {
        throw new Error(`Server error: ${response.status}`);
      }
    });

    if (response?.id && response?.message) {
      message.value = response.message;
      newProduct.value = { name: '', price: null };
      await fetchProducts(); // оновити список
    } else {
      error.value = 'Невідома помилка при додаванні продукту.';
    }
  } catch (err) {
    error.value = err.message || 'Сталася помилка при відправці запиту.';
    console.error('Помилка додавання продукту:', err);
  }
};

const deleteProduct = async (id) => {
  try {
    // await $fetch(`/api/products/remove/${id}`, { method: 'DELETE' });
    await $fetch(`/api/products/${id}`, { method: 'DELETE' });
    await fetchProducts(); // оновлюємо список після видалення
  } catch (err) {
    error.value = 'Помилка при видаленні продукту.';
    console.error('Delete error:', err);
  }
};

onMounted(fetchProducts);
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
