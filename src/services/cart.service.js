import mongoose from 'mongoose';
import Carts from '../dao/dbManagers/cart.dao.js';
import cartsRepository from '../repositories/carts.repository.js';
import productsRepository from '../repositories/products.repository.js';
import {generatePurchase} from '../services/tickets.service.js';


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

    cart.products.forEach(async ({
        product,
        quantity
    }) => {
        if (product.stock >= quantity) {
            amount += product.price * quantity;
            product.stock -= quantity;
            // Utilizar el repostiory de productos y actualizar el producto con el stock correspondiente
            await productsRepository.updateById('Id del producto', product) 
        } else {
            outStock.push({
                product,
                quantity
            });
        }
    });

    const ticket = await generatePurchase(user, amount);
    //actulizar el carrito con el nuevo arreglo de productos que no pudieron comprarse


    if (outStock.length > 0) {
        const message = `Los siguientes productos no pudieron ser comprados porque no hay stock suficiente:

${outStock.map(({ product }) => product.name).join(', ')}`;

        await notifyUser(user, message);
    }

    await cartsRepository.updateProducts(cid, outStock);

    await session.commitTransaction();

    //catch
    await session.abortTransaction();
    //finally
    session.endSession();
}

export {
    getAllCarts,
    saveCart,
    cartDelete,
    cartUpdate,
    cartById,
    cartProductId,
    cartDeleteProduct,
    purchase
}