import Ticket from '../dao/dbManagers/products.dao.js';

const daoProducts = new Ticket();

export default class productsRepository {
    save = async(ticket) => {
        const result = await daoTicket.save(ticket);
        return result;
    }
}