const express = require('express')
const rotas = express();
rotas.use(express.json());
const {listarItens,cadastrarItem,atualizarItem,deletarItem,listarItem} = require("./controladores/itens.js");
const {cadastrarUsuario,listarUsuarios,obterUsuario,editarUsuario,excluirUsuario} = require("./controladores/usuarios.js");
const {cadastrarChamado,listarChamados,obterChamado,editarChamado,excluirChamado,} = require("./controladores/chamados.js");
const { login } = require('./controladores/login');
const autenticar = require('./intermediarios/autenticacao');
const autorizar = require('./intermediarios/permissoes.js');

rotas.post('/login', login);


    // Itens
rotas.get('/itens/buscar/:id',autenticar,listarItem);
rotas.get('/itens',autenticar,listarItens);
rotas.post('/itens/cadastrar',autenticar,cadastrarItem);
rotas.put('/itens/editar/:id',autenticar,atualizarItem);
rotas.delete('/itens/deletar/:id',autenticar,deletarItem);


// usuarios
rotas.get('/usuarios', autenticar,autorizar('admin'), listarUsuarios);
rotas.get('/usuarios/buscar/:id', autenticar,autorizar('admin'),obterUsuario);
rotas.put('/usuarios/editar/:id', autenticar,autorizar('admin'),editarUsuario);
rotas.post('/usuarios/cadastrar', cadastrarUsuario);
rotas.delete('/usuarios/deletar/:id', autenticar,autorizar('admin'),excluirUsuario);

// chamados
rotas.get('/chamados', autenticar,listarChamados);
rotas.get('/chamados/buscar/:id', autenticar,obterChamado);
rotas.put('/chamados/editar/:id', autenticar,editarChamado);
rotas.post('/chamados/cadastrar', autenticar,cadastrarChamado);
rotas.delete('/chamados/deletar/:id', autenticar,excluirChamado);



module.exports = rotas;