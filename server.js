import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const API = 'https://fanese.perseus.com.br/PerseusPublicApi';

let TOKEN = null;

// ========================================
// LOGIN INTERNO
// ========================================

async function autenticarPerseus() {
  const response = await axios.post(
    `${API}/v1/autenticacao/obter-token`,
    {
      usuario: process.env.PERSEUS_USER,
      senha: process.env.PERSEUS_PASSWORD
    }
  );

  TOKEN = response.data.data.accessToken;
}

// ========================================
// CURRICULO
// ========================================

app.get('/curriculo', async (req, res) => {
  try {
    if (!TOKEN) {
      await autenticarPerseus();
    }

    const response = await axios.get(
      `${API}/v1/curriculos/obter-por-codigo`,
      {
        params: req.query,
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    res.json(response.data.data.pleno);
  } catch (err) {
    console.error(err.response?.data || err);

    res.status(500).json({
      erro: 'Erro ao buscar currículo'
    });
  }
});

// ========================================
// DISCIPLINA
// ========================================

app.get('/disciplina', async (req, res) => {
  try {
    if (!TOKEN) {
      await autenticarPerseus();
    }

    const response = await axios.get(
      `${API}/v1/disciplinassuperior/obter-por-codigo`,
      {
        params: {
          codigo: req.query.codigo
        },
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    res.json(response.data.data);
  } catch (err) {
    console.error(err.response?.data || err);

    res.status(500).json({
      erro: 'Erro ao buscar disciplina'
    });
  }
});

app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});