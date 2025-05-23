const jwt = require('jsonwebtoken');
require('dotenv').config();
const knex = require('../conexao');

const autenticar = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await knex('usuarios').where({ id }).first();

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('[Token Error]', error.message);
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

module.exports = autenticar;