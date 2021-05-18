const express = require('express')
const app = express()
const port = 3000
const { MongoClient } = require('mongodb')
const url = 'mongodb+srv://vladNMRC:Stanlox73rus@cluster0.vz1hd.mongodb.net/Carshop?retryWrites=true&w=majority'
const mongoClient = new MongoClient(url, {useUnifiedTopology: true})
const fetch = require('node-fetch')
const transfer = require('./transfer/transfer')
const redis = require('redis')
const redisPort = 6379
const redisClient = redis.createClient(redisPort)

const customerRouter = require('./routes/customerRTS')
const staffRouter = require('./routes/staffRTS')
const transportRouter = require('./routes/transportRTS')
const ticketRouter = require('./routes/ticketRTS')
const salesMagazineRouter = require('./routes/salesMagazineRTS')
const requestRouter = require('./routes/requestRTS')

app.use(express.json())
app.use(express.static('public'))

app.use('/api', customerRouter);
app.use('/api', staffRouter);
app.use('/api', transportRouter);
app.use('/api', ticketRouter);
app.use('/api', salesMagazineRouter);
app.use('/api', requestRouter);

const connect = async () => {
    try {
        await mongoClient.connect()
        console.log('NoSQL database connection established!')
    } catch (e) {
        console.log(e)
    }
}

connect()

function insertDataInRedix() {
    const p = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var info = insertDataInCache();
            resolve(info);
        });
    });
    p.then(data => {
        redisClient.set('requestOne', JSON.stringify(data[0]))
        redisClient.set('requestTwo', JSON.stringify(data[1]))
        redisClient.set('requestThree', JSON.stringify(data[2]))
        redisClient.set('requestFour', JSON.stringify(data[3]))
    });
}

app.get('/makeInquiries', function(req, res) {
    var timeBeforeRequest = new Date()
    console.log('time before request: ')
    console.log(timeBeforeRequest)
    const param = parseInt(req.query.numberRequest)
    var number = ''
    switch (param) {
        case 1:
            number = 'One'
            break;
        case 2:
            number = 'Two'
            break;
        case 3:
            number = 'Three'
            break;
        case 4:
            number = 'Four'
            break;
        default:
            return;
    }
    getDataInCache(number, timeBeforeRequest, res)
});

function timing(timeBeforeRequest) {
    var timeAfterRequest = new Date()
    console.log('time after request: ')
    console.log(timeAfterRequest)
    console.log(`time needed for request: ${timeAfterRequest - timeBeforeRequest} ms`)
}

function getDataInCache(number, timeBeforeRequest, res) {
    return redisClient.exists(`request` + number, (err, data) => {
        if (data == 1) {
            redisClient.get(`request` + number, (err, data) => {
                console.log('data from cache: ')
                console.log(data)
                timing(timeBeforeRequest)
                res.sendFile(__dirname + '/public/response.html')
            })
        }
    })
}

app.get('/insertData', function(req, res) {
    insertDataInRedix()
    res.sendFile(__dirname + '/public/response.html')
});

app.get('/transferData', function(req, res) {
    const p = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var info = getAllData();
            resolve(info);
        });
    });
    p.then(data => {
        transfer.createCustomer(mongoClient, data[0])
        transfer.createEmployee(mongoClient, data[1])
        transfer.createTransport(mongoClient, data[2])
        var array_ticket_id = []
        data[3].forEach(element => {
            array_ticket_id.push(element.ticket_id)
        });
        const pt = new Promise(function(resolve, reject) {
            setTimeout(() => {
                var info = getTicketData(data[3])
                resolve(info);
            });
        });
        pt.then(dt => {
            var array = []
            for(var i = 0; i < data[3].length; i++) {
                var object = {}
                object.total = data[3][i]['total']
                object.customer_series_and_number_of_passport = dt[i][0]['series_and_number_of_passport']
                object.employee_fullname = dt[i][1]['fullname']
                object.model = dt[i][2]['model']
                array.push(object)
            }
            const ps = new Promise(function(resolve, reject) {
                setTimeout(() => {
                    var info = transfer.createTicket(mongoClient, array)
                    resolve(info);
                });
            });
            ps.then(() => {
                transfer.createSale(mongoClient, data[4], array_ticket_id)
            })
        })
        res.sendFile(__dirname + '/public/response.html')
    });
});

async function getTicketData(data) {
    var array = []
    for (let obj of data) {
        var info = await ticketData(obj.customer_id, obj.employee_id, obj.transport_id)
        array.push(info)
    }
    return array
};

async function ticketData(customer_id, employee_id, transport_id) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomer(customer_id);
            resolve(infoC);
        });
    });
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployee(employee_id);
            resolve(infoE);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransport(transport_id);
            resolve(infoT);
        });
    });
    return await Promise.all([pc, pe, pt])
}

async function getAllData() {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers();
            resolve(infoC);
        });
    });
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees();
            resolve(infoE);
        });
    });
    const ptr = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports();
            resolve(infoT);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets();
            resolve(infoT);
        });
    });
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSalesMagazines();
            resolve(infoS);
        });
    });
    return await Promise.all([pc, pe, ptr, pt, ps])
}

async function insertDataInCache() {
    const pOne = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = requestOne();
            resolve(infoC);
        });
    });
    const pTwo = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = requestTwo();
            resolve(infoE);
        });
    });
    const pThree = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = requestThree();
            resolve(infoT);
        });
    });
    const pFour = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = requestFour();
            resolve(infoT);
        });
    });
    return await Promise.all([pOne, pTwo, pThree, pFour])
}

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});

app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

const getCustomers = async () => {
    return fetch('http://localhost:3000/api/customers')
    .then( res => res.json())
    .then( data => { return data })
}

const getCustomer = async (id) => {
    return fetch(`http://localhost:3000/api/customer/${id}`)
    .then( res => res.json())
    .then( data => { return data })
}

const getEmployees = async () => {
    return fetch(`http://localhost:3000/api/staff`)
    .then( res => res.json())
    .then( data => { return data })
}

const getEmployee = async (id) => {
    return fetch(`http://localhost:3000/api/staff/${id}`)
    .then( res => res.json())
    .then( data => { return data })
}

const getTransports = async () => {
    return fetch(`http://localhost:3000/api/transports`)
    .then( res => res.json())
    .then( data => { return data })
}

const getTransport = async (id) => {
    return fetch(`http://localhost:3000/api/transport/${id}`)
    .then( res => res.json())
    .then( data => { return data })
}

const getTickets = async () => {
    return fetch(`http://localhost:3000/api/tickets`)
    .then( res => res.json())
    .then( data => { return data })
}

const getSalesMagazines = async () => {
    return fetch(`http://localhost:3000/api/salesMagazines`)
    .then( res => res.json())
    .then( data => { return data })
}

const requestOne = async () => {
    return fetch(`http://localhost:3000/api/requestOne`)
    .then( res => res.json())
    .then( data => { return data })
}

const requestTwo = async () => {
    return fetch(`http://localhost:3000/api/requestTwo`)
    .then( res => res.json())
    .then( data => { return data })
}

const requestThree = async () => {
    return fetch(`http://localhost:3000/api/requestThree`)
    .then( res => res.json())
    .then( data => { return data })
}

const requestFour = async () => {
    return fetch(`http://localhost:3000/api/requestFour`)
    .then( res => res.json())
    .then( data => { return data })
}