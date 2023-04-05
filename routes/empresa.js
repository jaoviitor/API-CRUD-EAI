const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA AS EMPRESAS CADASTRADAS
router.get('/', (req, res, next) => {
    //res.status(200).send({
    //    mensagem: 'Retorna todas as solicitações'
    //});

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
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO Empresa (CNPJ, Nome_empresarial, Nome_fantasia, Porte, CEP, Logradouro, Numero, Complemento, Bairro, Municipio, UF, Telefone, Email, Senha_original) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.cnpj, req.body.nomeEmpresarial, req.body.nomeFantasia, req.body.porte, req.body.cep, req.body.logradouro, req.body.numero, req.body.complemento, req.body.bairro, req.body.municipio, req.body.uf, req.body.telefone, req.body.email, req.body.senha],
            (error, resultado, field) => {
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };

                res.status(201).send({
                    mensagem: 'Empresa cadastrada com sucesso!'
                })
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