const express = require('express')
const rotas = express();
rotas.use(express.json());
const {listarItens,
    cadastrarItem,
    atualizarItem,
    deletarItem,
    listarItem} = require("./controladores/itens.js");

rotas.get('/itens/buscar/:id',listarItem);
rotas.get('/itens',listarItens);
rotas.post('/itens/cadastrar',cadastrarItem);
rotas.put('/itens/editar/:id',atualizarItem);
rotas.delete('/itens/deletar/:id',deletarItem);


module.exports = rotas;