const express = require('express');
const app = express();
const request = require('request');
const frase = require('./frase.json');
const fs = require('fs');
const crypto = require('crypto');
const port = 3000;

app.get('/frase', (req, res) => {
    const tokenCaroline = 'eb0ff7a0e11a6b5522c138fdfca02b6d5ce0f13d';
    const hostname = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";
        request(`${hostname}${tokenCaroline}`, (err, body) => {
            if(err) {
                console.log(err);
            } else {
                fs.writeFile("./frase.json", (body.body), function (err) {
                    if (err) {
                      return res.status(500).send({ message: err });
                    }
                    res.send({message: "salvo"})
                    console.log("The file was saved!");
                  });   
            }
        })
});

app.get('/decifrada', (req, res) => {
    const fraseParaDecifrar = frase.cifrado;
    const deslocamento = frase.numero_casas;
    const deslocamentoReverso = deslocamento - (deslocamento * 2);

    const splitada = fraseParaDecifrar.split("");
    const code = splitada.map(letra => letra.charCodeAt());

    const decriptada = code.map(letra => {
        if(letra < 97 || letra > 122){
            return String.fromCharCode(letra);
        } else {
            return String.fromCharCode(((letra - 122 + deslocamentoReverso)%26)+122);
        }
    });

    const joinDecriptada = decriptada.join("")
    frase.decifrado = joinDecriptada;

    fs.writeFile("./frase.json", JSON.stringify(frase), function (err) {
        if (err) {
          return res.status(500).send({ message: err });
        }
        res.send({frase})
        console.log("Frase decriptada salva");
      });
});


app.get('/resumohash', (req, res) => {
    const secret = "jmb xli geywi, rsx xli wcqtxsq. wxizi qekymvi";
    const hash = crypto.createHash('sha1', secret)
                        .update("fix the cause, not the symptom. steve maguire")
                        .digest('hex');

    frase.resumo_criptografico = hash;

    fs.writeFile("./frase.json", JSON.stringify(frase), function (err) {
        if (err) {
          return res.status(500).send({ message: err });
        }
        res.send({frase})
        console.log("Resumo criptgrafico salvo");
      });

})

app.listen(port, err => {
    if(err) {
        console.log('Houve um erro ao iniciar o servidor');
    } else {
        console.log(`Servidor rodando na porta ${port}`)
    }
});
