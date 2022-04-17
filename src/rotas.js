const express = require('express');
const rotas = express();

const clientes = require("./controladores/clientes");

rotas.post("/clientes", clientes.cadastrarCliente);
rotas.get("/clientes", clientes.listarClientes);
rotas.get("/clientes/:id", clientes.detalharCliente);


module.exports = rotas;
