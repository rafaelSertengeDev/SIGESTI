const knex = require('../conexao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await knex('usuarios').where({ email }).first();

    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    // Remove a senha antes de enviar ao cliente
    const { senha: _, ...usuarioSemSenha } = usuario;

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    return res.status(200).json({ usuario: usuarioSemSenha, token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ erro: 'Erro interno no login.' });
  }
}

module.exports = {
  login
};
