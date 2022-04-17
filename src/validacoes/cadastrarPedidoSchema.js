const yup = require('./yup');

const cadastrarPedidoSchema = yup.object().shape({
  produto: yup
    .string()
    .required(),

  valor: yup
    .number().
    required(),

  descricao: yup
    .string()
    .required()
});

module.exports = cadastrarPedidoSchema;