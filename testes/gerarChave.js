const crypto = require('crypto');

function gerarChave(){
    const prefixo = 'EAI';
    const ramdomNum = crypto.randomInt(10000, 99999);
    
    const key = prefixo + ramdomNum;
    return key;
};

console.log(gerarChave());