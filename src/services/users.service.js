import Users from '../dao/dbManagers/users.dao.js';

const manager = new Users();

const getUserByEmail = async (email) => {
    const userEmail = await manager.getByEmail(email);

    return userEmail;
}

const saveUser = async (user) => {
    const userCreate = await manager.save(user);
    return userCreate;
}

const cartToUser = async (userId, cartId) => {
    const cartUser = await manager.addCartToUser(userId, cartId);

    return cartUser;
}



export {
    getUserByEmail,
    saveUser,
    cartToUser
}