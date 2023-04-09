const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        const query = 'SELECT * FROM Cadastro_clientes WHERE Email = ?';
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) };
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            }
            bcrypt.compare(req.body.senha, results[0].Senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if (result) {
                    const token = jwt.sign({
                        id_cliente: results[0].Id_cliente,
                        email: results[0].Email
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            });
        });
    });
});

module.exports = router;