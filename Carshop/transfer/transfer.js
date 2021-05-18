const dictionary = []

class Transfer {

    async createCustomer(client, data) {
        await client.db().createCollection('customer')
        const customers = client.db().collection('customer')
        for(var i = 0; i < data.length; i++) {
            delete data[i]['customer_id']
        }
        await customers.insertMany(data)
    }

    async createEmployee(client, data) {
        await client.db().createCollection('staff')
        const staff = client.db().collection('staff')
        for(var i = 0; i < data.length; i++) {
            delete data[i]['employee_id']
        }
        await staff.insertMany(data)
    }

    async createTransport(client, data) {
        await client.db().createCollection('transport')
        const transports = client.db().collection('transport')
        for(var i = 0; i < data.length; i++) {
            delete data[i]['transport_id']
        }
        await transports.insertMany(data)
    }

    async createTicket(client, data) {
        await client.db().createCollection('ticket')
        const tickets = client.db().collection('ticket')
        await tickets.insertMany(data)
    }

    async createSale(client, data, array_ticket_id) {
        await client.db().createCollection('sales_magazine')
        const salesMagazines = client.db().collection('sales_magazine')
        const tickets = client.db().collection('ticket')
        var cnt = 0
        await tickets.find({ }, {_id: 1}).forEach(function(u) {
            var obj = { _id : u._id, ticket_id : array_ticket_id[cnt]}
            dictionary.push(obj)
            cnt++;
        })
        for(var i = 0; i < data.length; i++) {
            delete data[i]['sale_id']
            const res = dictionary.find(rec => rec.ticket_id === data[i]['ticket_id'])
            data[i]['ticket_id'] = res._id;
        }
        await salesMagazines.insertMany(data)
    }
}

module.exports = new Transfer();