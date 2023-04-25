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

router.post('/cadastro_cliente', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query('SELECT * FROM Empresa WHERE email = ?', [req.body.email], (error, results) =>{
            if(error) { return res.status(500).send({ error: error })}
            if(results.length > 0) {
                res.status(409).send({ mensagem: 'Empresa já cadastrada' })
            } else{
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) =>{
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(`INSERT INTO cadastro_cliente (id_cliente, nome, email, telefone, senha) VALUES (?,?,?,?,?)`,
                    [req.body.id_cliente, req.body.nome, req.body.email, req.body.telefone, req.body.senha, hash],
                    (error, results) =>{
                        conn.release();
                        if (error) { return res.status(500).send({ error: error })}
                        res.status(201).send({
                            mensagem: 'Empresa cadastrada com sucesso!'
                        })
                    })
                })
            }
        })
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