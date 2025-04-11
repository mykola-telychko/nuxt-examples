import { defineEventHandler, readBody, createError } from 'h3';
import getConnection from '../../utils/db';

interface UpdateProductData {
  id: number;
  name: string;
  price: number;
}

export default defineEventHandler(async (event) => {

  // console.log('Updating product:_11', event.node.req.method); // patch
  // console.log('Updating product:_11', event, event.node.req.method);
  if (event.node.req.method !== 'PATCH') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed. Use PATCH.'
    });
  }

  let connection;
  try {

    const body = await readBody<UpdateProductData>(event);
    const { id, name , price } = body;
    name + "";

    console.log('Updating product:_2', id, name, price);

    if (!id || !name || typeof price !== 'number') {
      id || !name || typeof price
      throw createError({
        statusCode: 400,
        statusMessage: 'Please provide id, name and a valid price.'
      });
    }

    
    connection = await getConnection();
    const [result] = await connection.execute(
      'UPDATE products SET name = ?, price = ? WHERE id = ?',
      [name, price, id]
    );

    return {
      message: `Product "${name}" successfully updated (ID ${id})`
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product in the database'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
