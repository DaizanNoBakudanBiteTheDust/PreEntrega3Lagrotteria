import mongoose from 'mongoose';
import cartsRepository from '../repositories/carts.repository.js';
import productsRepository from '../repositories/products.repository.js';
import {generatePurchase} from './tickets.service.js';


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
    try {
      const session = await mongoose.startSession();
      session.startTransaction();  

      console.log(user)
      console.log(cid)

           // Obtener carrito
      const cart = user.carts[0].cart;
      // Transacciones

      if (!cart) {
        console.log("carrito no encontrado")
      }else{
        console.log("carrito encontrado")
      }
  
      // Procesar productos
      let amount = 0;
      const outStock = [];

      cart.products.forEach(async ({ product, quantity }) => {
        if (product.stock >= quantity) {
          amount += product.precio * quantity;
          product.stock -= quantity;
          await productRepo.updateById(product._id);
        } else {
          outStock.push({ product, quantity });
        }
      });

      
      const ticket = await generatePurchase(user, amount);

      console.log(ticket)

      // Confirmar transacción
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error; // Relanzar el error para que sea manejado en otro lado
    } finally {
      session.endSession();
    }

      // Notificar usuario (si hay productos sin stock)
  if (outStock.length > 0) {
    console.log(`Los siguientes productos no pudieron ser comprados porque no hay stock suficiente:\n${outStock.map(({ product }) => product.name).join('\n')}`);
  }

  // Vaciar carrito
  cart.products = [];


  };

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