import mongoose from 'mongoose';
import Carts from '../dao/dbManagers/cart.dao.js';

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

//compra

const purchase = async (cid, user) => {
    //Transacciones
    const session = await mongoose.startSession();
    session.startTransaction();

    let amount = 0;

    const outStock = [];

    cart.products.forEach(async ({ product, quantity }) => {
        if(product.stock >= quantity) {
            amount += product.price * quantity;
            product.stock -= quantity;
            // Utilizar el repostiory de productos y actualizar el producto con el stock correspondiente
            await productsReposity.updateById('Id del producto', product) //HACER REPOSITORY DE PRODUTOS
        } else {
            outStock.push({ product, quantity });
        }
    });

    const ticket = await ticketsService.generatePurchase(user, amount);
    //actulizar el carrito con el nuevo arreglo de productos que no pudieron comprarse
    //utilizar el repository de carritos para poder actualizar los productos
    await cartsRepository.updateProducts(cid, outStock); //HACER REPOSITORY DE CARROS

    await session.commitTransaction();

    //catch
    await session.abortTransaction();
    //finally
    session.endSession();
}

export{
    getAllCarts,
    saveCart,
    cartDelete,
    cartUpdate,
    cartById,
    cartProductId,
    cartDeleteProduct,
    purchase
}