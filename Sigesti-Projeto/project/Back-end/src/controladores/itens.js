const knex = require('../conexao');


// Obter um item específico por ID
const listarItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await knex('itens').where({ id }).first();

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    return res.json(item);
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    return res.status(500).json({ erro: 'Erro ao buscar item.' });
  }
}


// Listar todos os itens
const listarItens = async(req, res) => {
  try {
    const itens = await knex('itens').select('*');
    return res.json(itens);
  } catch (error) {
    console.error('Erro ao listar itens:', error); // <--- log detalhado
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
    const itemExiste = await knex('itens').where({ numero_serie }).first();
    if (itemExiste) {
      return res.status(400).json({ erro: 'Número de série já cadastrado.' });
    }

    const novoItem = await knex('itens')
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
    console.error('Erro ao cadastrar item:', error); // <--- log detalhado
    return res.status(500).json({ erro: 'Erro ao cadastrar item.' });
  }
}

const atualizarItem = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const itemExistente = await knex('itens').where({ id }).first();
    if (!itemExistente) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }
    if (
      dados.numero_serie &&
      dados.numero_serie !== itemExistente.numero_serie
    ) {
      const duplicado = await knex('itens')
        .where('numero_serie', dados.numero_serie)
        .andWhereNot('id', id)
        .first();

      if (duplicado) {
        return res.status(400).json({
          erro: 'Já existe um item com esse número de série.',
        });
      }
    }

    await knex('itens').where({ id }).update(dados);
    return res.json({ mensagem: 'Item atualizado com sucesso.' });

  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar item.' });
  }
}

const deletarItem = async (req, res) =>{
  const { id } = req.params;

  try {
    const item = await knex('itens').where({ id }).first();
    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    await knex('itens').where({ id }).del();
    return res.json({ mensagem: 'Item excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao excluir item.' });
  }
}

module.exports = {
  listarItem,
  listarItens,
  cadastrarItem,
  atualizarItem,
  deletarItem
};