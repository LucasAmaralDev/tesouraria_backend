import express = require('express');
import cors = require('cors');
import { AppDataSource } from './database/data-source';
import { userRoutes } from './routes/user.routes';
import { categoriaRoutes } from './routes/categoria.routes';
import { transacoesRouter } from './routes/transacoes.routes';

const appDataSource = AppDataSource;
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes)
app.use(categoriaRoutes)
app.use(transacoesRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

