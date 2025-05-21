const express = require('express')
const rotas = express();
rotas.use(express.json());
const {listarItens,cadastrarItem,atualizarItem,deletarItem,listarItem} = require("./controladores/itens.js");
const {cadastrarUsuario,listarUsuarios,obterUsuario,editarUsuario,excluirUsuario} = require("./controladores/usuarios.js");
const {cadastrarChamado,listarChamados,obterChamado,editarChamado,excluirChamado,} = require("./controladores/chamados.js");

    // Itens
rotas.get('/itens/buscar/:id',listarItem);
rotas.get('/itens',listarItens);
rotas.post('/itens/cadastrar',cadastrarItem);
rotas.put('/itens/editar/:id',atualizarItem);
rotas.delete('/itens/deletar/:id',deletarItem);


// usuarios
rotas.get('/usuarios',listarUsuarios);
rotas.get('/usuarios/buscar/:id',obterUsuario);
rotas.put('/usuarios/editar/:id',editarUsuario);
rotas.post('/usuarios/cadastrar',cadastrarUsuario);
rotas.delete('/usuarios/deletar/:id',excluirUsuario);

// chamados
rotas.get('/chamados',listarChamados);
rotas.get('/chamados/buscar/:id',obterChamado);
rotas.put('/chamados/editar/:id',editarChamado);
rotas.post('/chamados/cadastrar',cadastrarChamado);
rotas.delete('/chamados/deletar/:id',excluirChamado);



module.exports = rotas;