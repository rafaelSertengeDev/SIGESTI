const db = require('../conexao');

// Listar todos os itens
const listarItens = async(req, res) => {
  try {
    const itens = await db('itens').select('*');
    return res.json(itens);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar itens.' });
  }
}

// Cadastrar novo item
const cadastrarItem = async(req, res) => {
  const {
    nome,
    tipo,
    marca_modelo,
    numero_serie,
    localizacao,
    status,
    responsavel_id,
    data_entrada,
    observacoes
  } = req.body;

  if (!nome || !tipo) {
    return res.status(400).json({ erro: 'Nome e tipo são obrigatórios.' });
  }

  try {
    const itemExiste = await db('itens').where({ numero_serie }).first();
    if (itemExiste) {
      return res.status(400).json({ erro: 'Número de série já cadastrado.' });
    }

    const novoItem = await db('itens')
      .insert({
        nome,
        tipo,
        marca_modelo,
        numero_serie,
        localizacao,
        status,
        responsavel_id,
        data_entrada,
        observacoes
      })
      .returning('*');

    return res.status(201).json(novoItem[0]);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao cadastrar item.' });
  }
}

// Atualizar um item
const atualizarItem = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const item = await db('itens').where({ id }).first();
    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    await db('itens').where({ id }).update(dados);
    return res.json({ mensagem: 'Item atualizado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar item.' });
  }
}

// Deletar item
const deletarItem = async (req, res) =>{
  const { id } = req.params;

  try {
    const item = await db('itens').where({ id }).first();
    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    await db('itens').where({ id }).del();
    return res.json({ mensagem: 'Item excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao excluir item.' });
  }
}

module.exports = {
  listarItens,
  cadastrarItem,
  atualizarItem,
  deletarItem
};