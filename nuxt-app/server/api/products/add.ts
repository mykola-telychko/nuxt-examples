import { defineEventHandler, readBody, createError } from 'h3';
import getConnection from '../../utils/db';
import { ResultSetHeader } from 'mysql2';

interface ProductData {
  name: string;
  price: number;
}

export default defineEventHandler(async (event) => {
  
      if (event.node.req.method !== 'POST') {
        throw createError({
          statusCode: 405,
          statusMessage: 'Method Not Allowed. Use POST.'
        });
      }

      let connection;
      try {
        const body = await readBody<ProductData>(event);
        const { name, price } = body;

        if (!name || typeof price !== 'number') {
          throw createError({
            statusCode: 400,
            statusMessage: 'Please provide product name and a valid price.'
          });
        }

        connection = await getConnection();
        const [result] = await connection.execute<ResultSetHeader>(
          'INSERT INTO products (name, price) VALUES (?, ?)',
          [name, price]
        );

        return {
          id: result.insertId,
          message: `Product "${name}" successfully added with ID ${result.insertId}`
        };
      } catch (error) {
        console.error('Error adding product:', error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to add product to the database'
        });
      } finally {
        if (connection) {
          connection.release();
        }
      }
});