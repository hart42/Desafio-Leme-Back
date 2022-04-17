const knex = require('../bancoDeDados/conexao');
const cadastroClienteSchema = require('../validacoes/cadastroClienteSchema');

const cadastrarCliente = async (req, res) => {
  const {
    nome,
    cpf,
    data_nasc,
    telefone
  } = req.body;

  try {
    await cadastroClienteSchema.validate(req.body);

    const verificarCPF = await knex('clientes')
      .where({ cpf })
      .first();

    if(verificarCPF) {
      return res.status(401).json("CPF ja cadastrado");
    }

    const dataNacimento = new Date(data_nasc);
    const today = new Date();

    if(+dataNacimento >= +today) {
      return res.status(403).json("Data de nacimento invalida");
    }

    const cliente = await knex('clientes')
      .insert({
        nome,
        cpf,
        data_nasc,
        telefone
      })
      .returning("*");

    if(!cliente) {
      return res.status(400).json("O cliente não foi cadastrado.");
    }

    return res.status(201).json("Cliente cadastrado com sucesso");

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex('clientes').select("*");

    if (clientes[0] === undefined) {
      return res.status(400).json("Não foi encontrado nenhum cliente");
    }

    return res.status(200).json(clientes);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await knex('clientes')
      .where({ id })
      .select('*')
      .first();

    if (!cliente) {
      return res.status(404).json("O cliente procurado não existe");
    }

    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const editarCliente = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    cpf,
    data_nasc,
    telefone
  } = req.body;

  try {
    await cadastroClienteSchema.validate(req.body);

    const verificaId = await knex('clientes')
      .where({ id })
      .first();

    if (!verificaId) {
      return res.status(404).json("O cliente procurado não foi encontrado!")
    }

    const verificarCpf = await knex('clientes')
      .where({ cpf }).where('id', '!=', id)
      .first();

    if (verificarCpf) {
      return res.status(401).json("Cpf ja registrado em outro cliente");
    }

    const cliente = await knex('clientes')
      .update({
        nome,
        cpf,
        data_nasc,
        telefone
      }).where({ id })
      .returning('*');

    if (!cliente) {
      return res.status(400).json("O cliente não foi editado.");
    }

    return res.status(201).json("Cliente editado com sucesso");

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deletarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const verificarCliente = await knex('clientes')
      .where({ id })
      .first();

    if (!verificarCliente) {
      return res.status(404).json("Cliente não encontrado");
    }

    const excluirCliente = await knex('clientes')
      .where({ id })
      .del()
      .returning('*');

    if (!excluirCliente) {
      return res.status(400).json("Cliente não foi deletado");
    }

    return res.status(200).json("cliente excluido com sucesso!");

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente,
  editarCliente,
  deletarCliente
};