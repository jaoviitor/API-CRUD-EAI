const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaLoginEmpresa = require('./routes/loginEmpresa')
const rotaEmpresa = require('./routes/empresa');
const rotaPedidos = require('./routes/pedidos');
const rotaCadastroClientes = require('./routes/cadastro_cliente');
const rotaLoginClientes = require('./routes/login_cliente');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use('/empresa', rotaEmpresa);
app.use('/pedidos', rotaPedidos);
app.use('/cadastro', rotaCadastroClientes);
<<<<<<< HEAD
app.use('/loginempresa', rotaLoginEmpresa)
=======
app.use('/login', rotaLoginClientes);
>>>>>>> e519487278c0d952df8593405923f1b0127ab5b6

//TRATAMENTO PARA QUANDO NÃO FOR ENCONTRADO UMA ROTA
app.use((req, res, next) =>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;