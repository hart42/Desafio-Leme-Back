const knex = require('../bancoDeDados/conexao');
const cadastrarPedidoSchema = require("../validacoes/cadastrarPedidoSchema");

const cadastrarPedido = async (req, res) => {
  const { id } = req.params;
  const {
    produto,
    valor,
    descricao
  } = req.body;
  
  try {
    await cadastrarPedidoSchema.validate(req.body);

    const verificaId = await knex('clientes').where({ id }).first();

    if (!verificaId) {
      return res.status(404).json("O cliente não foi encontrado!");
    }

    const pedidoStatus = await knex("pedido_status")
      .insert({
        descricao
      })
      .returning("id");

    if(!pedidoStatus) {
      return res.status(400).json("O pedidio não foi cadastrado.");
    }

    const data = new Date();
    const pedido_status_id = pedidoStatus[0].id;

    const pedido = await knex("pedidos")
      .insert({
        produto,
        valor,
        data,
        cliente_id: id,
        pedido_status_id
      })
      .returning("*")

    if(!pedido) {
      return res.status(400).json("O pedido não foi realizado.");
    }

    return res.status(201).json("Pedido cadastrado com sucesso");


  } catch (error) {
    return res.status(400).json(error.message);
  }
};



module.exports = {
  cadastrarPedido,
};
