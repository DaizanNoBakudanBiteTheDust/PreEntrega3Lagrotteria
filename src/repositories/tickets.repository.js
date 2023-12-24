export default class ticketRepository {
    save = async(ticket) => {
        const result = await this.dao.save(ticket);
        return result;
    }
}