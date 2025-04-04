import { defineEventHandler, createError } from 'h3';
import getConnection from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
  id: number;
  name: string;
  price: number;
}

export default defineEventHandler(async (event) => {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute<Product[]>('SELECT id, name, price FROM products'); // Замініть 'products' на назву вашої таблиці
    return rows;
  } catch (error) {
    console.error('Помилка отримання продуктів з бази даних:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Не вдалося отримати дані з бази даних'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});