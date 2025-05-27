require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');
const app = express();


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use(rotas);


app.listen(3000,console.log("Servidor iniciado"));
