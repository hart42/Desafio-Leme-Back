const express = require('express');
const rotas = express();

const clientes = require("./controladores/clientes");

rotas.post("/clientes", clientes.cadastrarCliente);

module.exports = rotas;
