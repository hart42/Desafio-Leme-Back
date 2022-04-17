const yup = require('./yup');

const cadastroClienteSchema = yup.object().shape({
  nome: yup
    .string()
    .required(),

  cpf: yup
    .string().
    required(),

  data_nasc: yup
    .date()
    .required(),

  telefone: yup
    .string()
});

module.exports = cadastroClienteSchema;