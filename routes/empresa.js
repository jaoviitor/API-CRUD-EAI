const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const login = require('../middleware/login');
const gerarToken = require('../functions/keyGenerator');
const nodemailer = require('nodemailer');

//RETORNA AS EMPRESAS CADASTRADAS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Empresa;',
            (error, resultado, fields) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
    
});

//CADASTRA UMA NOVA EMPRESA NO BANCO
router.post('/cadastro', (req, res, next) => {
    const tamanhoToken = 6;
    const token = gerarToken(tamanhoToken);
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query('SELECT * FROM Empresa WHERE Email = ?', [req.body.Email], (error, results) =>{
            if(error) { return res.status(500).send({ error: error })}
            if(results.length > 0) {
                res.status(409).send({ mensagem: 'Empresa já cadastrada' })
            } else{
                bcrypt.hash(req.body.Senha, 10, (errBcrypt, hash) =>{
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(`INSERT INTO Empresa (Situacao, CNPJ, Nome_empresarial, Nome_fantasia, Porte, CEP, Logradouro, Numero, Complemento, Bairro, Municipio, UF, Telefone, Email, Senha, tokenVerificacao) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [req.body.Situacao, req.body.CNPJ, req.body.Nome_empresarial, req.body.Nome_fantasia, req.body.Porte, req.body.CEP, req.body.Logradouro, req.body.Numero, req.body.Complemento, req.body.Bairro, req.body.Municipio, req.body.UF, req.body.Telefone, req.body.Email, hash, token],
                    (error, results) =>{
                        conn.release();
                        if (error) { return res.status(500).send({ error: error })}
                        const transporter = nodemailer.createTransport({
                            host: process.env.HOST_MAIL,
                            port: process.env.HOST_PORT,
                            auth: {
                                user: process.env.HOST_USER,
                                pass: process.env.HOST_PASS
                            }
                        });
                        const sender = {
                            name: 'Contato',
                            email: 'sender.eai@outlook.com'
                        }
                        const receiver = {
                            email: `${req.body.Email}`
                        }
                        const mailContent = {
                            subject: 'Verifique sua conta',
                            text: `Valide sua conta informando o o token: ${token}`,
                            html: `<p>Valide sua conta informando o o token: ${token}</p>`
                        }
                        async function sendMail(transporter, sender, receiver, mailContent){
                            const mail = await transporter.sendMail({
                                from: `"${sender.name}" ${sender.email}`,
                                to: `${receiver.email}`,
                                subject: `${mailContent.subject}`,
                                text: `${mailContent.text}`,
                                html: `${mailContent.html}`
                            });
                            console.log('Email enviado: ', mail.messageId);
                            console.log('URL do Ethereal: ', nodemailer.getTestMessageUrl(mail));
                        }
                        async function mail(){
                            try{
                                await sendMail(transporter, sender, receiver, mailContent);
                                res.status(201).send({
                                    mensagem: 'Operação realizada com sucesso!'
                                })
                            } catch(error){
                                return res.status(500).send({ error: error })
                            }
                        }
                        mail();
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
                //adicionar select nome da empresa
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
						CodEmpresa: results[0].CodEmpresa,
						Nome_fantasia: results[0].Nome_fantasia,
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            })
        })
    })
})


//criar variácel com o id da empresa logada para fazer o get, pode pegar do token

//RETORNA OS DADOS DE UMA EMPRESA 
router.get('/:CodEmpresa', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error){ return res.status(500).send({ error: error }) };
        conn.query(
            'SELECT * FROM Empresa WHERE CodEmpresa = ?;',
            [req.params.CodEmpresa],
            (error, resultado, fields) =>{
                conn.release();
                if(error){ return res.status(500).send({ error: error }) };
                return res.status(200).send({response: resultado});
            }
        )
    })
});
//ALTERA
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o PATCH'
    });
});
//EXCLUI
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o DELETE'
    });
});

module.exports = router;
