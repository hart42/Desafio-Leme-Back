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

const listarPedidos = async (req, res) => {
  try {
    const pedidos = await knex("pedidos").select("*");

    if(pedidos[0] === undefined) {
      return res.status(400).json("Não foi encontrado nenhum pedido");
    }

    return res.status(200).json(pedidos);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const detalharPedido = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await knex('pedidos')
      .where({ id })
      .select('*')
      .first();

    if(!pedido) {
      return res.status(404).json("Pedido não encontrado");
    }

    return res.status(200).json(pedido);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const editarStatus = async (status, id_status, descricao) => {
  try {
    const verificaStatus = await knex("pedido_status")
      .where({ id: id_status })
      .first();

    if(!verificaStatus) {
      return false;
    }
    
    if(status === "Solicitado") {
      const novoStatus = await knex("pedido_status")
        .update({
          solicitado: true,
          concluido: false,
          cancelado: false,
          descricao
        })
        .where({ id: id_status })
        .returning("*");

      if(!novoStatus) {
        return false;
      }
    }

    if(status === "Concluido") {
      const novoStatus = await knex("pedido_status")
        .update({
          solicitado: false,
          concluido: true,
          cancelado: false,
          descricao
        })
        .where({ id: id_status })
        .returning("*");

      if(!novoStatus) {
        return false;
      }
    }

    if(status === "Cancelado") {
      const novoStatus = await knex("pedido_status")
        .update({
          solicitado: false,
          concluido: false,
          cancelado: true,
          descricao
        })
        .where({ id: id_status })
        .returning("*");

      if(!novoStatus) {
        return false;
      }
    }

    return true;

  } catch (error) {
    console.log(error.message);
  }
};

const editarPedido = async (req, res) => {
  const { id } = req.params;
  const {
    produto,
    valor,
    descricao,
    data,
    status
  } = req.body;

  try {
    await cadastrarPedidoSchema.validate(req.body);

    const verificaId = await knex("pedidos")
      .where({ id })
      .select("*")
      .first();
    
    if(!verificaId) {
      return res.status(404).json("O pedio procurado não foi encontrado!");
    }

    const dataAtualizada = new Date(data);

    const statusAtualizado = editarStatus(status, verificaId.pedido_status_id, descricao);

    if(!statusAtualizado) {
      return res.status(400).json("Erro ao atualizar o status");
    }

    const pedido = await knex("pedidos")
      .update({
        produto,
        valor,
        data: dataAtualizada,
      })
      .where({ id })
      .returning("*");
    
    if(!pedido) {
      return res.status(400).json("O pedido não foi editado.");
    }

    return res.status(201).json("pedido editado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deletarPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const verificarPedido = await knex('pedidos')
      .where({ id })
      .first();

    if (!verificarPedido) {
      return res.status(404).json("Pedido não encontrado");
    }

    const excluirPedido = await knex("pedidos")
      .where({ id })
      .del()
      .returning("*");
    
    if(!excluirPedido) {
      return res.status(400).json("Erro ao excluir o pedido");
    }

    const excluirStatus = await knex("pedido_status")
      .where({ id: verificarPedido.pedido_status_id })
      .del()
      .returning("*");
  
    if(!excluirStatus) {
      return res.status(400).json("Erro ao excluir o status");
    }

    return res.status(200).json("Pedido excluido com sucesso!");

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastrarPedido,
  listarPedidos,
  detalharPedido,
  editarPedido,
  deletarPedido
};
