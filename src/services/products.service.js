import Products from '../dao/dbManagers/products.dao.js';

const manager = new Products();

const getAllProducts = async () => {
    const allProducts = await manager.getAll();

    return allProducts;
}

const saveProduct = async () => {
    const saveProducts = await manager.save();

    return saveProducts;
}

const deleteProduct = async () => {
    const deleteProducts = await manager.delete();

    return deleteProducts;
}

const idProduct = async () => {
    const idOfProducts = await manager.getProductById();

    return idOfProducts;
}

export {
    getAllProducts,
    saveProduct,
    deleteProduct,
    idProduct
}