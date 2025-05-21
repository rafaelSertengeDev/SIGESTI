const knex = require('../conexao');
const { DateTime } = require('luxon');

const cadastrarChamado = async (req, res) => {
  const {
    equipamento_id,
    categoria,
    descricao,
    tecnico_id,
    data_registro
  } = req.body;

  if (!equipamento_id || !categoria || !descricao || !tecnico_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  try {
    const dataFinal = data_registro
      ? DateTime.fromISO(data_registro, { zone: 'America/Sao_Paulo' }).toJSDate()
      : DateTime.now().setZone('America/Sao_Paulo').toJSDate();
      

    const [chamado] = await knex('chamados')
      .insert({
        equipamento_id,
        categoria,
        descricao,
        tecnico_id,
        data_registro: dataFinal
      })
      .returning('*');

    return res.status(201).json(chamado);
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar chamado.' });
    }
  }


  const obterChamado = async(req, res) => {
    const { id } = req.params;
  
    try {
      const chamado = await knex('chamados')
        .select(
          'chamados.*',
          'itens.nome as equipamento_nome',
          'usuarios.nome as tecnico_nome'
        )
        .leftJoin('itens', 'chamados.equipamento_id', 'itens.id')
        .leftJoin('usuarios', 'chamados.tecnico_id', 'usuarios.id')
        .where('chamados.id', id)
        .first();
  
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado não encontrado.' });
      }
  
      chamado.data_registro = chamado.data_registro
        ? DateTime.fromJSDate(chamado.data_registro)
            .setZone('America/Sao_Paulo')
            .toFormat('yyyy-LL-dd HH:mm:ss')
        : null;
  
      return res.status(200).json(chamado);
    } catch (error) {
      console.error('Erro ao obter chamado:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar chamado.' });
    }
  }
  
  const listarChamados = async (req, res) => {
    try {
      const chamados = await knex('chamados')
        .select(
          'chamados.*',
          'itens.nome as equipamento_nome',
          'usuarios.nome as tecnico_nome'
        )
        .leftJoin('itens', 'chamados.equipamento_id', 'itens.id')
        .leftJoin('usuarios', 'chamados.tecnico_id', 'usuarios.id');
  
      const chamadosFormatados = chamados.map(chamado => ({
        ...chamado,
        data_registro: chamado.data_registro
          ? DateTime.fromJSDate(chamado.data_registro)
              .setZone('America/Sao_Paulo')
              .toFormat('yyyy-LL-dd HH:mm:ss')
          : null
      }));
  
      return res.status(200).json(chamadosFormatados);
    } catch (error) {
      console.error('Erro ao listar chamados:', error);
      return res.status(500).json({ erro: 'Erro ao listar chamados.' });
    }
  }
  
  const editarChamado = async (req, res) => {
    const { id } = req.params;
    const {
      equipamento_id,
      categoria,
      descricao,
      tecnico_id,
      solucao,
      status,
      data_registro
    } = req.body;
  
    try {
      const chamadoExistente = await knex('chamados').where({ id }).first();
      if (!chamadoExistente) {
        return res.status(404).json({ erro: 'Chamado não encontrado.' });
      }
  
      const dataFinal = data_registro
        ? DateTime.fromISO(data_registro, { zone: 'America/Sao_Paulo' }).toJSDate()
        : chamadoExistente.data_registro;
  
      await knex('chamados')
        .where({ id })
        .update({
          equipamento_id,
          categoria,
          descricao,
          tecnico_id,
          solucao,
          status,
          data_registro: dataFinal
        });
  
      return res.status(200).json({ mensagem: 'Chamado atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar chamado.' });
    }
  }
  
  const excluirChamado = async (req, res) => {
    const { id } = req.params;
  
    try {
      const chamado = await knex('chamados').where({ id }).first();
  
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado não encontrado.' });
      }
  
      await knex('chamados').where({ id }).del();
      return res.json({ mensagem: 'Chamado excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir chamado:', error);
      return res.status(500).json({ erro: 'Erro ao excluir chamado.' });
    }
  }
  
  module.exports = {
    cadastrarChamado,
    listarChamados,
    obterChamado,
    editarChamado,
    excluirChamado,
  };