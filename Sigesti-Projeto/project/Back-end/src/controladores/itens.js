const knex = require('../conexao');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'America/Sao_Paulo';


// Obter um item específico por ID
const listarItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await knex('itens').where({ id }).first();

    if (!item) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    item.data_entrada = item.data_entrada
      ? dayjs(item.data_entrada).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
      : null;

    return res.json(item);
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    return res.status(500).json({ erro: 'Erro ao buscar item.' });
  }
}

// Listar todos os itens
const listarItens = async (req, res) => {
  try {
    const itens = await knex('itens').select('*');

    const itensFormatados = itens.map(item => ({
      ...item,
      data_entrada: item.data_entrada
        ? dayjs(item.data_entrada).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
        : null
    }));

    return res.json(itensFormatados);
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    return res.status(500).json({ erro: 'Erro ao listar itens.' });
  }
}

// Cadastrar novo item
const cadastrarItem = async (req, res) => {
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

    const dataFinal = data_entrada
      ? dayjs(data_entrada).tz(TIMEZONE).toDate()
      : dayjs().tz(TIMEZONE).toDate();

    const [novoItem] = await knex('itens')
      .insert({
        nome,
        tipo,
        marca_modelo,
        numero_serie,
        localizacao,
        status,
        responsavel_id,
        data_entrada: dataFinal,
        observacoes
      })
      .returning('*');

      novoItem.data_entrada = novoItem.data_entrada
  ? dayjs(novoItem.data_entrada).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
  : null;

    return res.status(201).json(novoItem);
  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
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

    if (dados.data_entrada) {
      dados.data_entrada = dayjs(dados.data_entrada).tz(TIMEZONE).toDate();
    }

    await knex('itens').where({ id }).update(dados);
    return res.json({ mensagem: 'Item atualizado com sucesso.' });

  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar item.' });
  }
}

const deletarItem = async (req, res) => {
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