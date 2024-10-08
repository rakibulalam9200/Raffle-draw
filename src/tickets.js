const Ticket = require("./Ticket");
const {readFile,writeFile} = require('./utils');

const tickets = Symbol('tickets')

class TicketCollection {
    constructor(){
        // Immediately Invoked Function Expressions (IIFE)  as don't able to do contructor async
       (async function () {
        this[tickets] =  await readFile()
       }.call(this))
    }

    /**
     * create and save new ticket
     * @param {string} username 
     * @param {number} price 
     */

    create(username,price){
        const ticket = new Ticket(username,price)
        this[tickets].push(ticket)
        writeFile(this[tickets])
        return ticket;
    }

    /**
     * 
     * @param {string} username 
     * @param {number} price 
     * @param {number} quantity 
     * @return {Ticket[]}
     */

    createBulk(username,price,quantity){
        const result = []
        for(let i = 0; i<quantity; i++){
            const ticket = this.create(username,price);
            result.push(ticket)
        }
        writeFile(this[tickets])
        return result;
    }

    /**
     * return all tickets from db
     */

    findallTickets(){
        return this[tickets]
    }

    /**
     * find single ticket
     * @param {string} id 
     * @return {Ticket} 
     */

    findById(id){
        const ticket = this[tickets].find(
            /**
             * 
             * @param {Ticket} ticket 
             * @returns 
             */
            (ticket) => ticket.id === id
        )
        return ticket;
    }

    /**
     * find single ticket by username
     * @param {string} username 
     * @return {Ticket[]} 
     */

    findByUsername(username){
        const tickets = this[tickets].filter(
            /**
             * 
             * @param {Ticket} ticket 
             * @returns 
             */
            (ticket) => ticket.username === username
        )
        return tickets;
    }

    /**
     * 
     * @param {string} ticketId 
     * @param {{username: string,price: number}} ticketBody 
     * @return {Ticket}
     */

    updateById(ticketId,ticketBody){
        const ticket = this.findById(ticketId)
        if(ticket){
            ticket.username = ticketBody.username ?? ticket.username
            ticket.price = ticketBody.price ?? ticket.price
        }

        writeFile(this[tickets])
        
        return ticket
    }

    /**
     * 
     * @param {string} username 
     * @param {{username:string,price:number}} ticketBody 
     * @return {Ticket[]}
     */
    updateBulk(username,ticketBody){
        const userTickets = this.findByUsername(username)
        const updatedTickets = userTickets.map(
            /**
             * 
             * @param {Ticket} ticket 
             * 
             */
            (ticket)=> this.updateById(ticket.id,ticketBody)
        )

        writeFile(this[tickets])

        return updatedTickets
    }

    /**
     * delete ticket by ticketId
     * @param {string} ticketId 
     * @return {boolean}
     */

    deleteById(ticketId){
        const index= this[tickets].findIndex(
            /**
             * 
             * @param {Ticket} ticket 
             * 
             */
            (ticket)=> ticket.id === ticketId
        )
        if(index === -1){
            return false
        }else{
            this[tickets].splice(index,1);
            writeFile(this[tickets])
            return true;
        }
    }
    /**
     * 
     * @param {string} username 
     * @return {bollean []}
     */

    deleteBulk(username){
        const userTickets = this.findByUsername(username)
        const deletedResult = userTickets.map(
            /**
             * 
             * @param {Ticket} ticket 
             * @return {boolean}
             */
            (ticket)=> this.deleteById(ticket?.id)
        )
        writeFile(this[tickets])
        return deletedResult;
    }

    /**
     * 
     * @param {number} winnerCount 
     * @return {Ticket[]}
     */

    drawer(winnerCount){
        const winnerIndexes = new Array(winnerCount);
        let winnerIndex = 0;
        while(winnerIndex < winnerCount){
            let ticketIndex = Math.floor(Math.random() * this[tickets].length);
            if(!winnerIndexes.includes(ticketIndex)){
                winnerIndexes[winnerIndex++] = ticketIndex;
                continue;
            }
        }
        const winners = winnerIndexes.map(
            /**
             * 
             * @param {number} index 
             * 
             */
            (index)=> this[tickets][index]
        )

        return winners;
        
    }

}


const collection = new TicketCollection()
module.exports = collection;

