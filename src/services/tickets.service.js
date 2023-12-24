import Ticket from '../dao/dbManagers/tickets.dao,js';
import TicketRepository from '../repositories/tickets.repository.js';

const generatePurchase = async (user, amount) => { 
    const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount,
        purchaser: user.email
    }

    await ticketRepository.save(newTicket);
}