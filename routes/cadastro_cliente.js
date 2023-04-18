const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/:id_cliente', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Cadastro_clientes WHERE Id_cliente = ?;',
            [req.params.id_cliente],
            (error, resultado, fields) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO Cadastro_clientes (Id_cliente, Nome, Email, Telefone, Senha) VALUES (?,?,?,?,?)',
            [req.body.id_cliente,req.body.nome, req.body.email, req.body.telefone, req.body.senha],
            (error, resultado, fields) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
});

router.patch('/:id_cliente', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'UPDATE Cadastro_clientes SET Nome = ?, Email = ?, Telefone = ?, Senha = ? WHERE Id_cliente = ?',
            [req.body.nome, req.body.email, req.body.telefone, req.body.senha, req.params.id_cliente],
            (error, resultado, fields) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                res.status(202).send({
                    mensagem: 'Cliente atualizado com sucesso!',
                });
            }
        )
    })
});

module.exports = router;