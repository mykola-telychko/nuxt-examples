import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  return {
    message: 'Hi from Nuxt.js!',
    timestamp: Date.now()
  };
});