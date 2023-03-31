const express = require('express');
const router = express.Router();

//RETORNA OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna os pedidos'
    });
});

//INSERE OS PEDIDOS
router.post('/', (req, res, next) => {
    const pedido = {
        id_solicitacao: req.body.id_solicitacao,
        quantidade: req.body.quantidade
    }

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