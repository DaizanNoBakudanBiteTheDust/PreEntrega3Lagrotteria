import { v4 as uuidv4 } from 'uuid';
import ticketRepository from '../repositories/users.repository.js';

const ticketRepo = new ticketRepository();


const generatePurchase = async (user, amount) => { 

    const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount,
        purchaser: user.email
    }

    await ticketRepo.save(newTicket);
}

export{
    generatePurchase
}