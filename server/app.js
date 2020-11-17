const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const cors = require('cors');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//Mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'segundo_parcial'
});

app.get('/ver_cliente/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM clientes WHERE row_id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not results');
        }
    });
});

app.put('/editar_cliente/:id', (req, res) => {
    const id  = req.params.id;
    const nombre = req.body.nombre;
    const apellido_paterno = req.body.apellido_paterno;
    const apellido_materno = req.body.apellido_materno;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const colonia = req.body.colonia;
    var zona = req.body.zona;
    const num_contrato = req.body.num_contrato;
    var kilowatts = req.body.kilowatts;
    var edad = req.body.edad;
    var total = 0;
    if(zona === 'A'){
        var total = kilowatts * 0.3;
    } else if(zona === 'B'){
        var total = kilowatts * 0.4;
    } else if(zona === 'C'){
        var total = kilowatts * 0.5;
    }

    if(total < 150){
        total = 150;
    } 

    if(edad >= 60){
        total = total - (total * 0.50);
    }
    const sql = `UPDATE clientes SET nombre = '${nombre}', apellido_paterno='${apellido_paterno}', apellido_materno='${apellido_materno}', calle='${calle}', numero='${numero}', colonia='${colonia}', zona='${zona}', num_contrato='${num_contrato}', kilowatts='${kilowatts}', edad='${edad}', total='${total}' WHERE row_id = ${id}`;
    connection.query(sql, err => {
        if (err) throw err;
        res.send('Cliente actualizado!');
    });
});

app.delete('/eliminar_cliente/:id', (req, res) => {
    const id  = req.params.id;
    const sql = `DELETE FROM clientes WHERE row_id = ${id}`;
    connection.query(sql, err => {
        if (err) throw err;
        res.send('Cliente eliminado!');
    });
});

//todo los clientes
app.get('/listar_clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send('Not results');
        }
    });
});

app.post('/agregar_cliente', (req, res) => {
    const sql = 'INSERT INTO clientes (num_contrato, nombre, apellido_paterno, apellido_materno, calle, numero, colonia, zona, edad, kilowatts, total) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    const nombre = req.body.nombre;
    const apellido_paterno = req.body.apellido_paterno;
    const apellido_materno = req.body.apellido_materno;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const colonia = req.body.colonia;
    var zona = req.body.zona;
    const num_contrato = req.body.num_contrato;
    var kilowatts = req.body.kilowatts;
    var edad = req.body.edad;
    var total = 0;
    if(zona === 'A'){
        var total = kilowatts * 0.3;
    } else if(zona === 'B'){
        var total = kilowatts * 0.4;
    } else if(zona === 'C'){
        var total = kilowatts * 0.5;
    }

    if(total < 150){
        total = 150;
    } 

    if(edad >= 60){
        total = total - (total * 0.50);
    }

    connection.query(sql, [num_contrato,nombre, apellido_paterno, apellido_materno, calle, numero, colonia, zona, edad, kilowatts, total], (err, result) => { res.send(result); });
});

//Route
app.get('/', (req, res) => {
    res.send('Welcome to my APPI');
});

//Chel connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));