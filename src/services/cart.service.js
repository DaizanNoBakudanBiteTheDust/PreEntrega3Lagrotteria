import Carts from '../dao/dbManagers/cart.manager.js';

const manager = new Carts(); 

const getAllCarts = async () => {
    const carts = await manager.getAll();

    return carts;
}

const saveCart = async (cart) => {
    const saveCarts = await manager.save(cart);

    return saveCarts;
}

const cartUpdate = async (id, cart) => {
    const updateCarts = await manager.update(id, cart);

    return updateCarts;
}

const cartDelete = async (id, cart) => {
    const deleteCarts = await manager.delete(id, cart);

    return deleteCarts;
}

const cartById = async (id) => {
    const idCarts = await manager.getCartById(id);

    return idCarts;
}

const cartProductId = async (id) => {
    const productCarts = await manager.getProductById(id);

    return productCarts;
}


const cartDeleteProduct = async (id, cart) => {
    const deleteProductCarts = await manager.deleteProductById(id, cart);

    return deleteProductCarts;
}


export{
    getAllCarts,
    saveCart,
    cartDelete,
    cartUpdate,
    cartById,
    cartProductId,
    cartDeleteProduct
}