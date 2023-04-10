const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
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

module.exports = router;
