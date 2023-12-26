import Carts from '../dao/dbManagers/cart.dao.js';

const daoCarts = new Carts();

export default class cartsRepository {
    save = async(cart) => {
        const result = await daoCarts.saveCart(cart);
        return result;
    }

    updateProducts = async(id, cart) => {
        const result = await daoCarts.update(id, cart);
        return result;
    }

    findById = async(id) => {
        const result = await daoCarts.getCartById(id);
        return result;
    }

    productById = async(id) => {
        const result = await daoCarts.getProductById(id);
        return result;
    }
}