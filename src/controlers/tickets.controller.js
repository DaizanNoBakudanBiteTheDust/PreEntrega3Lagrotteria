import generatePurchase from '../services/tickets.service.js';
import purchase from '../services/cart.service.js';

const purchaseFromCart = purchase();

const purchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const { user } = req.user;

        const result = await purchaseFromCart(cid, user);
        
        res.send({ result });
    } catch (error) {
        res.status(500).send()
    }
}