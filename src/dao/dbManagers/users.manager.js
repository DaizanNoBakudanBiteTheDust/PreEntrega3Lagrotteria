import  usersModel from "./models/users.models.js";

export default class Users {
    constructor() {
        console.log('Working users with DB');
    }

    getByEmail = async(email) => {
        const user = await usersModel.findOne({ email }).lean();
        return user;
    }

    save = async(user) => {
        const result = await usersModel.create(user);
        return result; 
    }
    
    addCartToUser = async(userId, cartId) => {
        try {
            const user = await usersModel.findById(userId);

            if (!user) {
                console.error('Usuario no encontrado');
                return;
            }

            if (!user.carts || user.carts.length === 0) {
                // Si el usuario no tiene un carrito, crea uno nuevo
                await usersModel.findByIdAndUpdate(userId, { $push: { carts: { cart: cartId } } }, { new: true });
                console.log('Carrito agregado al usuario');
            } else {
                console.log('El usuario ya tiene un carrito');
            }
        } catch (error) {
            console.error('Error al agregar carrito al usuario:', error);
        }
    }
} 