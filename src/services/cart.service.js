import mongoose from 'mongoose';
import cartsRepository from '../repositories/carts.repository.js';
import productsRepository from '../repositories/products.repository.js';
import {
  generatePurchase
} from './tickets.service.js';
import nodemailer from 'nodemailer';


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

const purchase = async (cid, user) => {

  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Obtener carrito

    const cart = await cartRepo.findById(cid);

    console.log(cart);

    // Transacciones
    if (!cart) {
      console.log("carrito no encontrado")
    } else {
      console.log("carrito encontrado")
    }

    // Procesar productos
    let amount = 0;
    const outStock = [];


    console.log("Estado del carrito antes de procesar productos:", cart);


    const productsToUpdate = [];

    await Promise.all(cart.products.map(async ({
      product,
      quantity
    }) => {
      
        if (product.stock >= quantity) {
          const amountForProduct = product.precio * quantity;
          amount += amountForProduct;
          // Actualizar stock
          productsToUpdate.push({
            _id: product._id,
            $set: {
                stock: product.stock - quantity
            }
        });
        } else {
          outStock.push({
            product,
            quantity
          });
          console.log(`Product ${product._id} is out of stock.`);
        }
    
    }));


    const ticket = await generatePurchase(user, amount);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: 'gabriellagrotteria18@gmail.com',
        pass: 'vfkdolrcdjbivjfg'
      }
    });

    const formattedTicket = `
      <h3>Tu ticket de compra</h3>
      <p>Código: ${ticket.code}</p>
      <p>Fecha de compra: ${ticket.purchase_datetime}</p>
      <p>Monto: $${ticket.amount}</p>
      <p>Comprador: ${ticket.purchaser}</p>
  `;

    await transporter.sendMail({
      from: 'gabriellagrotteria18@gmail.com', // Reemplaza con el remitente deseado
      to: 'gabriellagrotteria18@gmail.com', // Dirección de correo del usuario
      subject: 'Ticket de compra',
      html: formattedTicket // Puedes personalizar el formato del correo
    });

    console.log(ticket)

    // Confirmar transacción
    await session.commitTransaction();

  
    await productRepo.updateById()

    await cartRepo.emptycart(cid);

  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.log("Error durante la compra:", error);
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }

  }

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