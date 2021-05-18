const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const path = require('path')
const dateFormat = require('dateformat')
const url = require('url')

const customerRouter = require('./routes/customerRTS')
const staffRouter = require('./routes/staffRTS')
const transportRouter = require('./routes/transportRTS')
const ticketRouter = require('./routes/ticketRTS')
const salesMagazineRouter = require('./routes/salesMagazineRTS')
const selectionRouter = require('./routes/selectionRTS')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/api', customerRouter);
app.use('/api', staffRouter);
app.use('/api', transportRouter);
app.use('/api', ticketRouter);
app.use('/api', salesMagazineRouter);
app.use('/api', selectionRouter);

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
});

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

app.get('/main', function(req, res) {
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/createCustomer', function(req, res) {
    res.sendFile(__dirname + '/public/Create/createCustomer.html');
});

app.get('/createEmployee', function(req, res) {
    res.sendFile(__dirname + '/public/Create/createEmployee.html');
});

app.get('/createTransport', function(req, res) {
    res.sendFile(__dirname + '/public/Create/createTransport.html');
});

app.get('/createTicket', function(req, res) {
    const p = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var info = getSetDataForTicket(null, null, null, 0);
            resolve(info);
        });
    });
    p.then((values) => {
        var strC = []
        for(var i = 0; i < values[0].length; i++) {
            strC.push(values[0][i].customer_id)
            strC.push(values[0][i].fullname)
            strC.push(values[0][i].series_and_number_of_passport)
        }
        var outC = strC.join(',')
        var strE = []
        for(var i = 0; i < values[1].length; i++) {
            strE.push(values[1][i].employee_id)
            strE.push(values[1][i].fullname)
            strE.push(values[1][i].position)
            strE.push(values[1][i].number_of_sales)
            strE.push(values[1][i].wage)
        }
        var outE = strE.join(',')
        var strT = []
        for(var i = 0; i < values[2].length; i++) {
            strT.push(values[2][i].transport_id)
            strT.push(values[2][i].country)
            strT.push(values[2][i].brand)
            strT.push(values[2][i].model)
            strT.push(values[2][i].cost)
        }
        var outT = strT.join(',')
        res.render('Create/createTicket.html', {optionsOne:outC, optionsTwo: outE, optionsThree: outT});
        res.sendFile(__dirname + '/public/Create/createTicket.html');
    });
});

app.get('/createSale', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, null);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        res.render('Create/createSale.html', {options: dataT});
        res.sendFile(__dirname + '/public/Create/createSale.html');
    });
});

app.get('/readCustomer', function(req, res) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(null, 0);
            resolve(infoC);
        });
    });
    pc.then((dataC) => {
        var str = []
        dataC.forEach(element => {
            str.push(element.customer_id)
            str.push(element.fullname)
            str.push(element.series_and_number_of_passport)
        });
        res.render('Read/readCustomer.html', {options: str});
        res.sendFile(__dirname + '/public/Read/readCustomer.html');
    });
});

app.get('/readEmployee', function(req, res) {
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(null, 0);
            resolve(infoE);
        });
    });
    pe.then((dataE) => {
        var str = []
        dataE.forEach(element => {
            str.push(element.employee_id)
            str.push(element.fullname)
            str.push(element.position)
            str.push(element.number_of_sales)
            str.push(element.wage)
        });
        res.render('Read/readEmployee.html', {options: str});
        res.sendFile(__dirname + '/public/Read/readEmployee.html');
    });
});

app.get('/readTransport', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(null, 0);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        var str = []
        dataT.forEach(element => {
            str.push(element.transport_id)
            str.push(element.country)
            str.push(element.brand)
            str.push(element.model)
            str.push(element.cost)
        });
        res.render('Read/readTransport.html', {options: str});
        res.sendFile(__dirname + '/public/Read/readTransport.html');
    });
});

app.get('/readTicket', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, 0);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        var str = []
        dataT.forEach(element => {
            str.push(element.ticket_id)
            str.push(element.total)
            str.push(element.transport_id)
            str.push(element.customer_id)
            str.push(element.employee_id)
        });
        res.render('Read/readTicket.html', {options: str});
        res.sendFile(__dirname + '/public/Read/readTicket.html');
    });
});

app.get('/readSale', function(req, res) {
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSales(null, 0);
            resolve(infoS);
        });
    });
    ps.then((dataS) => {
        var str = []
        dataS.forEach(element => {
            str.push(element.sale_id)
            str.push(new Date(element.date_of_payment).format('dd.mm.yyyy'))
            str.push(element.ticket_id)
        });
        res.render('Read/readSale.html', {options: str});
        res.sendFile(__dirname + '/public/Read/readSale.html');
    });
});

app.get('/updateCustomer', function(req, res) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(null, 0);
            resolve(infoC);
        });
    });
    pc.then((dataC) => {
        var str = []
        dataC.forEach(element => {
            str.push(element.customer_id)
            str.push(element.fullname)
            str.push(element.series_and_number_of_passport)
        });
        res.render('Update/updateCustomer.html', {options: str});
        res.sendFile(__dirname + '/public/Update/updateCustomer.html');
    });
});

app.get('/updateEmployee', function(req, res) {
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(null, 0);
            resolve(infoE);
        });
    });
    pe.then((dataE) => {
        var str = []
        dataE.forEach(element => {
            str.push(element.employee_id)
            str.push(element.fullname)
            str.push(element.position)
            str.push(element.number_of_sales)
            str.push(element.wage)
        });
        res.render('Update/updateEmployee.html', {options: str});
        res.sendFile(__dirname + '/public/Update/updateEmployee.html');
    });
});

app.get('/updateTransport', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(null, 0);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        var str = []
        dataT.forEach(element => {
            str.push(element.transport_id)
            str.push(element.country)
            str.push(element.brand)
            str.push(element.model)
            str.push(element.cost)
        });
        res.render('Update/updateTransport.html', {options: str});
        res.sendFile(__dirname + '/public/Update/updateTransport.html');
    });
});

app.get('/updateTicket', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, null);
            resolve(infoT);
        });
    });
    const pd = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoD = getSetDataForTicket(null, null, null, 0);
            resolve(infoD);
        });
    });
    Promise.all([pt, pd]).then(values => {
        var strC = []
        for(var i = 0; i < values[1][0].length; i++) {
            strC.push(values[1][0][i].customer_id)
            strC.push(values[1][0][i].fullname)
            strC.push(values[1][0][i].series_and_number_of_passport)
        }
        var outC = strC.join(',')
        var strE = []
        for(var i = 0; i < values[1][1].length; i++) {
            strE.push(values[1][1][i].employee_id)
            strE.push(values[1][1][i].fullname)
            strE.push(values[1][1][i].position)
            strE.push(values[1][1][i].number_of_sales)
            strE.push(values[1][1][i].wage)
        }
        var outE = strE.join(',')
        var strT = []
        for(var i = 0; i < values[1][2].length; i++) {
            strT.push(values[1][2][i].transport_id)
            strT.push(values[1][2][i].country)
            strT.push(values[1][2][i].brand)
            strT.push(values[1][2][i].model)
            strT.push(values[1][2][i].cost)
        }
        var outT = strT.join(',')
        res.render('Update/updateTicket.html', {optionsOne: values[0], optionsTwo: outC, optionsThree: outE, optionsFour: outT});
        res.sendFile(__dirname + '/public/Update/updateTicket.html');
    });
});

app.get('/updateSale', function(req, res) {
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSales(null, null);
            resolve(infoS);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, null);
            resolve(infoT);
        });
    });
    Promise.all([ps, pt]).then(values => {
        res.render('Update/updateSale.html', {optionsOne: values[0], optionsTwo: values[1]});
        res.sendFile(__dirname + '/public/Update/updateSale.html');
    });
});

app.get('/deleteCustomer', function(req, res) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(null, 0);
            resolve(infoC);
        });
    });
    pc.then((dataC) => {
        var str = []
        dataC.forEach(element => {
            str.push(element.customer_id)
            str.push(element.fullname)
            str.push(element.series_and_number_of_passport)
        });
        res.render('Delete/deleteCustomer.html', {options: str});
        res.sendFile(__dirname + '/public/Delete/deleteCustomer.html');
    });
});

app.get('/deleteEmployee', function(req, res) {
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(null, 0);
            resolve(infoE);
        });
    });
    pe.then((dataE) => {
        var str = []
        dataE.forEach(element => {
            str.push(element.employee_id)
            str.push(element.fullname)
            str.push(element.position)
            str.push(element.number_of_sales)
            str.push(element.wage)
        });
        res.render('Delete/deleteEmployee.html', {options: str});
        res.sendFile(__dirname + '/public/Delete/deleteEmployee.html');
    });
});

app.get('/deleteTransport', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(null, 0);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        var str = []
        dataT.forEach(element => {
            str.push(element.transport_id)
            str.push(element.country)
            str.push(element.brand)
            str.push(element.model)
            str.push(element.cost)
        });
        res.render('Delete/deleteTransport.html', {options: str});
        res.sendFile(__dirname + '/public/Delete/deleteTransport.html');
    });
});

app.get('/deleteTicket', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, null);
            resolve(infoT);
        });
    });
    const pd = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var info = getSetDataForTicket(null, null, null, 0);
            resolve(info);
        });
    });
    Promise.all([pt, pd]).then(values => {
        var strC = []
        for(var i = 0; i < values[1][0].length; i++) {
            strC.push(values[1][0][i].customer_id)
            strC.push(values[1][0][i].fullname)
            strC.push(values[1][0][i].series_and_number_of_passport)
        }
        var outC = strC.join(',')
        var strE = []
        for(var i = 0; i < values[1][1].length; i++) {
            strE.push(values[1][1][i].employee_id)
            strE.push(values[1][1][i].fullname)
            strE.push(values[1][1][i].position)
            strE.push(values[1][1][i].number_of_sales)
            strE.push(values[1][1][i].wage)
        }
        var outE = strE.join(',')
        var strT = []
        for(var i = 0; i < values[1][2].length; i++) {
            strT.push(values[1][2][i].transport_id)
            strT.push(values[1][2][i].country)
            strT.push(values[1][2][i].brand)
            strT.push(values[1][2][i].model)
            strT.push(values[1][2][i].cost)
        }
        var outT = strT.join(',')
        res.render('Delete/deleteTicket.html', {optionsOne: values[0], optionsTwo: outC, optionsThree: outE, optionsFour: outT});
        res.sendFile(__dirname + '/public/Delete/deleteTicket.html');
    });
});

app.get('/deleteSale', function(req, res) {
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSales(null, null);
            resolve(infoS);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(null, null);
            resolve(infoT);
        });
    });
    Promise.all([ps, pt]).then(values => {
        res.render('Delete/deleteSale.html', {optionsOne: values[0], optionsTwo: values[1]});
        res.sendFile(__dirname + '/public/Delete/deleteSale.html');
    });
});

app.get('/selectionFRB', function(req, res) {
    fetch('http://localhost:3000/api/selectionFRB')
    .then(res => res.json())
    .then(data => fillingDataFRB(res, data))
});

app.get('/selectionFMF', function(req, res) {
    fetch('http://localhost:3000/api/selectionFMF')
    .then(res => res.json())
    .then(data => fillingDataFMF(res, data))
});

app.get('/selectionFP', function(req, res) {
    const dates = []
    const reqUrl = req.url;
    const urlObj = url.parse(reqUrl, true);
    const queryData = urlObj.query;
    if(!queryData.dateFrom || !queryData.dateTo) {
        dates.push('01.01.1970')
        dates.push(new Date(Date.now()).format('dd.mm.yyyy'))
    }
    else
    {
        dates.push(queryData.dateFrom)
        dates.push(queryData.dateTo)
    }
    fetch('http://localhost:3000/api/selectionFP/' + dates)
    .then(res => res.json())
    .then(data => fillingDataFP(res, data))
});

app.post('/createCustomer', function(req, res) {
    const options = {
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
    };
    fetch('http://localhost:3000/api/customer', options)
    .then(response => res.sendFile(__dirname + '/public/response.html'))
});

app.post('/createEmployee', function(req, res) {
    const options = {
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
    };
    fetch('http://localhost:3000/api/staff', options)
    .then(response => res.sendFile(__dirname + '/public/response.html'))
});

app.post('/createTransport', function(req, res) {
    const options = {
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
    };
    fetch('http://localhost:3000/api/transport', options)
    .then(response => res.sendFile(__dirname + '/public/response.html'))
});

app.post('/createTicket', function(req, res) {
    const pd = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoD = getSetDataForTicket(req.body.customer_id / 3, req.body.employee_id / 5, req.body.transport_id / 5, null);
            resolve(infoD);
        });
    });
    pd.then((values) => {
        req.body.customer_id = values[0];
        req.body.employee_id = values[1];
        req.body.transport_id = values[2];
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
        };
        fetch('http://localhost:3000/api/ticket', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/createSale', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(req.body.ticket_id, null);
            resolve(infoT);
        })
    });
    pt.then((dataT) => {
        req.body.ticket_id = dataT;
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
        };
        fetch('http://localhost:3000/api/salesMagazine', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    })
});

app.post('/updateCustomer', function(req, res) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(req.body.customer_id / 3, null);
            resolve(infoC);
        });
    });
    pc.then((dataC) => {
        req.body.customer_id = dataC;
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
        };
        fetch('http://localhost:3000/api/customer', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/updateEmployee', function(req, res) {
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(req.body.employee_id / 5, null);
            resolve(infoE);
        });
    });
    pe.then((dataE) => {
        req.body.employee_id = dataE;
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
        };
        fetch('http://localhost:3000/api/staff', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/updateTransport', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(req.body.transport_id / 5, null);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        req.body.transport_id = dataT;
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
        };
        fetch('http://localhost:3000/api/transport', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/updateTicket', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(req.body.ticket_id, null);
            resolve(infoT);
        });
    });
    const pd = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var info = getSetDataForTicket(req.body.customer_id / 3, req.body.employee_id / 5, req.body.transport_id / 5, null);
            resolve(info);
        });
    });
    Promise.all([pt, pd]).then(values => {
        req.body.ticket_id = values[0];
        req.body.customer_id = values[1][0];
        req.body.employee_id = values[1][1];
        req.body.transport_id = values[1][2];
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
        };
        fetch('http://localhost:3000/api/ticket', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/updateSale', function(req, res) {
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSales(req.body.sale_id, null);
            resolve(infoS);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(req.body.ticket_id, null);
            resolve(infoT);
        });
    });
    Promise.all([ps, pt]).then(values => {
        req.body.sale_id = values[0];
        req.body.ticket_id = values[1];
        const options = {
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' },
            method: 'put',
        };
        fetch('http://localhost:3000/api/salesMagazine', options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/deleteCustomer', function(req, res) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(req.body.customer_id / 3, null);
            resolve(infoC);
        });
    });
    pc.then((dataC) => {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
        };
        fetch('http://localhost:3000/api/customer/' + dataC, options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/deleteEmployee', function(req, res) {
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(req.body.employee_id / 5, null);
            resolve(infoE);
        });
    });
    pe.then((dataE) => {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
        };
        fetch('http://localhost:3000/api/staff/' + dataE, options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/deleteTransport', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(req.body.transport_id / 5, null);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
        };
        fetch('http://localhost:3000/api/transport/' + dataT, options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/deleteTicket', function(req, res) {
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTickets(req.body.ticket_id, null);
            resolve(infoT);
        });
    });
    pt.then((dataT) => {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
        };
        fetch('http://localhost:3000/api/ticket/' + dataT, options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    });
});

app.post('/deleteSale', function(req, res) {
    const ps = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoS = getSales(req.body.sale_id, null);
            resolve(infoS);
        });
    });
    ps.then((dataS) => {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: 'delete',
        };
        fetch('http://localhost:3000/api/salesMagazine/' + dataS, options)
        .then(response => res.sendFile(__dirname + '/public/response.html'))
    })
});

async function getTickets(ticket_id, list) {
    return fetch('http://localhost:3000/api/tickets')
    .then( res => res.json())
    .then( data => {
        if(list === null) {
            return getTicketId(data, ticket_id);
        }
        return data
    })
}

function getTicketId(data, ticket_id) {
    var str = []
    for(var i = 0; i < data.length; i++) {
        str.push(data[i].ticket_id)
    }
    var out = str.join(', ')
    if(ticket_id === null) {
        return out
    }
    return str[ticket_id]
}

async function getCustomers(customer_id, list) {
    return fetch('http://localhost:3000/api/customers')
    .then( res => res.json())
    .then( data => {
        if(list === null) {
            return getCustomerId(data, customer_id)
        }
        return data
    })
}

function getCustomerId(data, customer_id) {
    var str = []
    for(var i = 0; i < data.length; i++) {
        str.push(data[i].customer_id);
    }
    var out = str.join(', ')
    if(customer_id === null) {
        return out
    }
    return str[customer_id]
}

async function getEmployees(employee_id, list) {
    return fetch('http://localhost:3000/api/staff')
    .then( res => res.json())
    .then( data => {
        if(list === null) {
            return getEmployeeId(data, employee_id)
        }
        return data
    })
}

function getEmployeeId(data, employee_id) {
    var str = []
    for(var i = 0; i < data.length; i++) {
        str.push(data[i].employee_id);
    }
    var out = str.join(', ')
    if(employee_id === null) {
        return out
    }
    return str[employee_id]
}

async function getTransports(transport_id, list) {
    return fetch('http://localhost:3000/api/transports')
    .then( res => res.json())
    .then( data => {
        if(list === null) {
            return getTransportId(data, transport_id)
        }
        return data
    })
}

function getTransportId(data, transport_id) {
    var str = []
    for(var i = 0; i < data.length; i++) {
        str.push(data[i].transport_id);
    }
    var out = str.join(', ')
    if(transport_id === null) {
        return out
    }
    return str[transport_id]
}

async function getSales(sale_id, list) {
    return fetch('http://localhost:3000/api/salesMagazines')
    .then( res => res.json())
    .then( data => {
        if(list === null) {
            return getSaleId(data, sale_id)
        }
        return data
    })
}

function getSaleId(data, sale_id) {
    var str = []
    for(var i = 0; i < data.length; i++) {
        str.push(data[i].sale_id);
    }
    var out = str.join(', ')
    if(sale_id === null) {
        return out
    }
    return str[sale_id]
}

async function getSetDataForTicket(customer_id, employee_id, transport_id, type) {
    const pc = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoC = getCustomers(customer_id, type);
            resolve(infoC);
        });
    });
    const pe = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoE = getEmployees(employee_id, type);
            resolve(infoE);
        });
    });
    const pt = new Promise(function(resolve, reject) {
        setTimeout(() => {
            var infoT = getTransports(transport_id, type);
            resolve(infoT);
        });
    });
    return await Promise.all([pc, pe, pt])
}

function fillingDataFRB(res, data) {
    var str = []
    data.forEach(element => {
        str.push(element.employee_name)
        str.push(element.customer_name)
        str.push(element.country)
        str.push(element.brand)
        str.push(element.model)
        str.push(element.total)
    });
    res.render('Selection/selectionFRB.html', {options: str});
    res.sendFile(__dirname + '/public/Selection/selectionFRB.html');
}

function fillingDataFMF(res, data) {
    var str = []
    data.forEach(element => {
        str.push(element.employee_name)
        str.push(element.customer_name)
        str.push(element.total)
        str.push(new Date(element.date_of_payment).format('dd.mm.yyyy'))
    });
    res.render('Selection/selectionFMF.html', {options: str});
    res.sendFile(__dirname + '/public/Selection/selectionFMF.html');
}

function fillingDataFP(res, data) {
    var str = []
    data.forEach(element => {
        str.push(new Date(element.date_of_payment).format('dd.mm.yyyy'))
        str.push(element.employee_name)
        str.push(element.total)
    });
    res.render('Selection/selectionFP.html', {options: str});
    res.sendFile(__dirname + '/public/Selection/selectionFP.html');
}