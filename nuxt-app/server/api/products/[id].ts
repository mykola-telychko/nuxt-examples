import { defineEventHandler, createError } from 'h3';
import getConnection from '../../utils/db';

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed. Use DELETE.'
    });
  }

  const id = Number(event.context.params?.id);

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product ID'
    });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      });
    }

    return {
      message: `Product with ID ${id} was successfully deleted.`
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product from the database'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
