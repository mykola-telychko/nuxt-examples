<template>
  <div>
    <h1>Update Product</h1>

    <ul>
      <li 
        v-for="product in products" 
        :key="product.id" 
        @click="selectProduct(product)"
        style="cursor: pointer; margin-bottom: 5px; color: blue;"
      >
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>

    <form @submit.prevent="updateProduct">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="selectedProduct.name" required>
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" id="price" v-model="selectedProduct.price" step="0.01" required>
      </div>
      <button type="submit">Update Product</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const products = ref([]);
const selectedProduct = ref({ id: null, name: '', price: null });
const message = ref('');
const error = ref('');

const fetchProducts = async () => {
  try {
    products.value = await $fetch('/api/products');
  } catch (err) {
    error.value = 'Не вдалося завантажити продукти.';
  }
};

const selectProduct = (product) => {
  selectedProduct.value = { ...product }; // створюємо копію, щоб не змінювати список напряму
};

const updateProduct = async () => {
  message.value = '';
  error.value = '';

  console.log('updateProduct', selectedProduct.value, selectedProduct.value.id);

  try {
    const response = await $fetch('/api/products/update', {
      method: 'PATCH',
      body: {
        id: selectedProduct.value.id,
        name: selectedProduct.value.name,
        price: selectedProduct.value.price
      }
    });
    console.log('Success response:', response);
    message.value = response.message || 'Продукт оновлено успішно!';
    await fetchProducts();
  } catch (err) {
    console.error('Update error:', err);
    error.value = err?.data?.statusMessage || 'Помилка при оновленні.';
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
