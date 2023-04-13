const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//RETORNA AS EMPRESAS CADASTRADAS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Empresa;',
            (error, resultado, fields) =>{
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
    
});

//CADASTRA UMA NOVA EMPRESA NO BANCO
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query('SELECT * FROM Empresa WHERE Email = ?', [req.body.Email], (error, results) =>{
            if(error) { return res.status(500).send({ error: error })}
            if(results.length > 0) {
                res.status(409).send({ mensagem: 'Empresa já cadastrada' })
            } else{
                bcrypt.hash(req.body.Senha, 10, (errBcrypt, hash) =>{
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(`INSERT INTO Empresa (CNPJ, Nome_empresarial, Nome_fantasia, Porte, CEP, Logradouro, Numero, Complemento, Bairro, Municipio, UF, Telefone, Email, Senha) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [req.body.CNPJ, req.body.Nome_empresarial, req.body.Nome_fantasia, req.body.Porte, req.body.CEP, req.body.Logradouro, req.body.Numero, req.body.Complemento, req.body.Bairro, req.body.Municipio, req.body.UF, req.body.Telefone, req.body.Email, hash],
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

router.post('/login', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM Empresa WHERE Email = ?`;
        conn.query(query,[req.body.Email], (error, results, fields) =>{
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1){ //conferindo se o email está no banco
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            }
            bcrypt.compare(req.body.Senha, results[0].Senha, (err, result) =>{ //comparando a senha com o hash
                if (err){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if (result){ //gerando o token
                    const token = jwt.sign({
                        CodEmpresa: results[0].CodEmpresa,
                        email: results[0].Email
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            })
        })
    })
})

//LOGIN DA EMPRESA
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error })};

        const email = req.body.email;
        const senha = req.body.senha;

        conn.query(
            'SELECT * FROM Empresa WHERE Email = ? AND Senha = ?;',
            [email, senha],
            (error, resultado, fields) =>{
                if(error){ return res.status(500).send({ error: error }) };

                if (resultado.length == 1) {
                    const token = jwt.sign(
                      { email: email, id: resultado[0].CodEmpresa }, // informações do usuário que serão incluídas no token
                      "DLKS43K6J8K32KNMA20P7KFM12XX", // process.env.JWT_KEY chave secreta para a assinatura do token (você pode gerar uma chave aleatória para isso)
                      { expiresIn: '1h' } // tempo de expiração do token
                    );
                    
                    console.log(token)
                    return res.status(200).send({ message: 'Login realizado com sucesso!', token: token });
                } else {
                    return res.status(401).send({ message: 'Credenciais inválidas!' });
                }
            }
        )
    })
});
//RETORNA OS DADOS DE UMA EMPRESA 
router.get('/:CodEmpresa', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Empresa WHERE CodEmpresa = ?;',
            [req.params.CodEmpresa],
            (error, resultado, fields) =>{
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
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