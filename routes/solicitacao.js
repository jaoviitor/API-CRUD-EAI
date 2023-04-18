const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});

//INSERE OS PEDIDOS
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        conn.query('INSERT INTO Solicitacao (Dt, Hora, Situacao, Servico, Localizacao, TipoLocal, AreaLocal, Telefone) VALUES (?,?,?,?,?,?,?,?)',
        [req.body.Dt, req.body.Hora, req.body.Situacao, req.body.Servico, req.body.Localizacao, req.body.TipoLocal, req.body.AreaLocal, req.body.Telefone],
        (error, resultado, field) =>{
            conn.release();

            if(error){
                res.status(500).send({ error: error, response: null });
            }
            res.status(201).send({ mensagem: 'Solicitação enviada!', CodSolicitacao: resultado.insertId })
        }
        )

    })
    res.status(201).send({
        mensagem: 'O pedido foi criado',
        pedidoCriado: pedido
    });
});

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) =>{
    const id = req.params.id_pedido

    res.status(200).send({
        mensagem: 'Detalhes do pedido',
        id_pedido: id
    })
});

//EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Pedido excluído'
    });
});

module.exports = router;