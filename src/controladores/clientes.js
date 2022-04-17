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
    
    const verificarCPF = await knex('clientes').where({ cpf }).first();

    if(verificarCPF) {
      return res.status(401).json("CPF ja cadastrado");
    }

    const dataNacimento = new Date(data_nasc);
    const today = new Date()

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
}

module.exports = {
  cadastrarCliente,

};