import Users from '../dao/dbManagers/users.dao.js';

const daoUsers = new Users();

export default class usersRepository {
    getUserByEmail = async (email) => {
        const userEmail = await daoUsers.getByEmail(email);
    
        return userEmail;
    }

    saveUser = async (user) => {
        const userCreate = await daoUsers.save(user);
        return userCreate;
    }
    
    cartToUser = async (userId, cartId) => {
        const cartUser = await daoUsers.addCartToUser(userId, cartId);
    
        return cartUser;
    }

    getUserById = async (id) => {
        const response = await daoUsers.getUserById(id);
    
        return response;
    }
}