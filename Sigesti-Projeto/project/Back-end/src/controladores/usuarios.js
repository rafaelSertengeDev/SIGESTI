const  knex  = require('../conexao');

// 1. Criar usuário
const cadastrarUsuario = async(req, res) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const existente = await knex('usuarios').where({ email }).first();
    if (existente) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const [usuario] = await knex('usuarios')
      .insert({ nome, email, senha, cargo })
      .returning(['id', 'nome', 'email', 'cargo']);

    return res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar usuário.' });
  }
}

// 2. Listar todos
const listarUsuarios = async(req, res) => {
  try {
    const usuarios = await knex('usuarios').select('id', 'nome', 'email', 'cargo');
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
}

// 3. Buscar por ID
const obterUsuario = async(req, res) => {
  const { id } = req.params;

  try {
    const usuario = await knex('usuarios').where({ id }).first();
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return res.status(500).json({ erro: 'Erro interno ao obter usuário.' });
  }
}

// 4. Atualizar
const  editarUsuario = async(req, res) =>{
  const { id } = req.params;
  const { nome, email, senha, cargo } = req.body;

  try {
    const usuario = await knex('usuarios').where({ id }).first();
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    await knex('usuarios')
      .where({ id })
      .update({ nome, email, senha, cargo });

    return res.json({ mensagem: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
  }
}

// 5. Deletar
const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await knex('usuarios').where({ id }).first();
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    await knex('usuarios').where({ id }).del();
    return res.json({ mensagem: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
  }
}

module.exports = {
  cadastrarUsuario,
  listarUsuarios,
  obterUsuario,
  editarUsuario,
  excluirUsuario,
};
