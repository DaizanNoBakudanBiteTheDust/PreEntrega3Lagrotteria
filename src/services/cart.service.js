import mongoose from 'mongoose';
import cartsRepository from '../repositories/carts.repository.js';
import productsRepository from '../repositories/products.repository.js';
import {generatePurchase} from '../services/tickets.service.js';

const cartRepo = new cartsRepository();
const productRepo = new productsRepository();

const getAllCarts = async () => {
    const carts = await cartRepo.getAll();

    return carts;
}

const saveCart = async (cart) => {
    const saveCarts = await cartRepo.save(cart);

    return saveCarts;
}

const cartUpdate = async (id, cart) => {
    const updateCarts = await cartRepo.updateProducts(id, cart);

    return updateCarts;
}

const cartDelete = async (id, cart) => {
    const deleteCarts = await cartRepo.delete(id, cart);

    return deleteCarts;
}

const cartById = async (id) => {
    const idCarts = await cartRepo.findById(id);

    return idCarts;
}

const cartProductId = async (id) => {
    const productCarts = await cartRepo.productById(id);

    return productCarts;
}


const cartDeleteProduct = async (id, cart) => {
    const deleteProductCarts = await cartRepo.deleteProductById(id, cart);

    return deleteProductCarts;
}

//compra

const purchase = async (cid, user) => {
    //Transacciones
    const session = await mongoose.startSession();
    session.startTransaction();

    const cart = await cartRepo.findById({cid}) // Suponiendo que tienes un repositorio para obtener carritos

if (!cart) {
    throw new Error('Carrito no encontrado'); // Handle el caso de que el carrito no exista
}

    let amount = 0;

    const outStock = [];

if (cart && cart.products && cart.products.length > 0) {
    cart.products.forEach(async ({ product, quantity }) => {
        if (product.stock >= quantity) {
            amount += product.price * quantity;
            product.stock -= quantity;
            await productRepo.updateById('Id del producto', product);
        } else {
            outStock.push({
                product,
                quantity
            });
        }
    });
}
    const ticket = await generatePurchase(user, amount);
    //actulizar el carrito con el nuevo arreglo de productos que no pudieron comprarse


    if (outStock.length > 0) {
        const message = `Los siguientes productos no pudieron ser comprados porque no hay stock suficiente:

${outStock.map(({ product }) => product.name).join(', ')}`;

        await notifyUser(user, message);
    }

    await cartRepo.updateProducts(cid, outStock);

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