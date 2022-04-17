const express = require('express');
const rotas = express();

const clientes = require("./controladores/clientes");
const pedidos = require("./controladores/pedidos");

rotas.post("/clientes", clientes.cadastrarCliente);
rotas.get("/clientes", clientes.listarClientes);
rotas.get("/clientes/:id", clientes.detalharCliente);
rotas.put('/clientes/:id', clientes.editarCliente);
rotas.delete('/clientes/:id', clientes.deletarCliente);

rotas.post("/pedidos/:id", pedidos.cadastrarPedido);

module.exports = rotas;
