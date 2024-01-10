import Products from '../dao/dbManagers/products.dao.js';

const daoProducts = new Products();

export default class productsRepository {
    updateById = async(id) => {
        const result = await daoProducts.getProductById(id);
        return result;
    }

    updateStock = async(id, newStockValue) => {
        try {
            const result = await daoProducts.updateStock(id, newStockValue);
            return result;
        } catch (error) {
            console.error(`Error al actualizar el stock del producto con ID ${id}:`, error);
            throw error; // Relanzar el error para que sea manejado en otro lugar si es necesario
        }
    };
}