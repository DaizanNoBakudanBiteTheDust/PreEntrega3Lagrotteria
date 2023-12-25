import Products from '../dao/dbManagers/products.dao.js';

const daoProducts = new Products();

export default class productsRepository {
    updateById = async(id) => {
        const result = await daoProducts.getProductById(id);
        return result;
    }
}