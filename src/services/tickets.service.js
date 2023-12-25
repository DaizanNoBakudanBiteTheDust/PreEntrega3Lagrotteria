import { v4 as uuidv4 } from 'uuid';

const generatePurchase = async (user, amount) => { 
    const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date().toLocaleString(),
        amount,
        purchaser: user.email
    }

    await ticketRepository.save(newTicket);
}

export{
    generatePurchase
}