const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');

//ENVIA EMAIL PARA CONTATO
router.post('/contato', (req, res, next) =>{
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL,
        port: process.env.HOST_PORT,
        auth: {
            user: process.env.HOST_USER,
            pass: process.env.HOST_PASS
        }
    });
    const sender = {
        name: req.body.Nome,
        email: process.env.HOST_USER
    }
    const receiver = {
        email: 'contato@mvp.eai.tec.br'
    }
    const mailContent = {
        subject: req.body.Subject,
        text: req.body.Message,
        html: `<p>${req.body.Message}</p>`
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
        } catch(error){
            console.log(error);
        }
    }

    mail();

    if (error) { return res.status(500).send({ error: error })}
    res.status(201).send({
        mensagem: 'Operação realizada com sucesso!'
    })
})

module.exports = router;