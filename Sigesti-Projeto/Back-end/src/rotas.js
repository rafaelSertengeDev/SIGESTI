const express = require('express')
const rotas = express();
rotas.use(express.json());
const {listarItens,
    cadastrarItem,
    atualizarItem,
    deletarItem} = require("./controladores/itens.js");

rotas.get('/itens',listarItens);
rotas.post('/itens/cadastrar',cadastrarItem);
rotas.put('/itens/editar',atualizarItem);
rotas.delete('/itens/deletar',deletarItem);


module.exports = rotas;