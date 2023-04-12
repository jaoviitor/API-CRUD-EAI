const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');

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

//CADASTRA UM NOVO FUNCIONÁRIO DA EMPRESA NO BANCO
router.post('/cadastrofuncionario', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'INSERT INTO parceiro (Nome, RG, CPF, Telefone, Sexo, Email, Senha_original, Senha) VALUES (?,?,?,?,?,?,?,?)',
            [req.body.nome, req.body.rg, req.body.cpf, req.body.telefone, req.body.sexo, req.body.email, req.body.senha1, req.body.senha2],
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
//LOGIN DA EMPRESA
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error })};

        const email = req.body.email;
        const senha = req.body.senha;

        conn.query(
            'SELECT * FROM Empresa WHERE Email = ? AND Senha_original = ?;',
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