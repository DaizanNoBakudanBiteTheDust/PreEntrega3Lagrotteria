import Users from '../dao/dbManagers/users.manager.js';

const manager = new Users();

const getUserByEmail = async (email) => {
    const userEmail = await manager.getByEmail(email);

    return userEmail;
}

const saveUser = async () => {
    const userCreate = await manager.save(user);

    return userCreate;
}

const cartToUser = async () => {
    const cartUser = await manager.addCartToUser(userId, cartId);

    return cartUser;
}



export {
    getUserByEmail,
    saveUser,
    cartToUser
}