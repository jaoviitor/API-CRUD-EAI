const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA AS SOLICITAÇÕES
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todas as solicitações'
    });

    
});
//INSERE AS SOLICITAÇÕES
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO Cliente (Nome, Email, Telefone, Senha_original) VALUES (?,?,?,?)',
            [req.body.name, req.body.email, req.body.telefone, req.body.senha],
            (error, resultado, field) => {
                conn.release();
                if(error){
                     return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(201).send({
                    mensagem: 'Solicitacao enviada!'
                })
            }
        )
    })
});
//RETORNA OS DADOS DE UMA SOLICITACAO
router.get('/:id_solicitacao', (req, res, next) =>{
    const id = req.params.id_solicitacao

    if(id === 'especial'){
        res.status(200).send({
            mensagem: 'você descobriu o ID especial',
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: 'você passou um ID'
        })
    };
});
//ALTERA UMA SOLICITACAO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH dentro da rota de solicitacao'
    });
});
//EXCLUI UMA SOLICITACAO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o DELETE dentro da rota de solicitacao'
    });
});

module.exports = router;