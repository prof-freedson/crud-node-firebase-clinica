const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const pacientesCollection = db.collection('pacientes');

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// Função auxiliar para formatar data para input date
function formatDateForInput(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toISOString().split('T')[0];
}

// Função auxiliar para converter string de data para Timestamp
function convertToTimestamp(dateString) {
  if (!dateString) return null;
  return admin.firestore.Timestamp.fromDate(new Date(dateString));
}

// ROTAS

// Página inicial - Menu com botões
app.get('/', (req, res) => {
  res.render('index');
});

// Página para listar todos os pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const snapshot = await pacientesCollection.orderBy('nome_pac').get();
    const pacientes = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      pacientes.push({
        id: doc.id,
        nome_pac: data.nome_pac,
        data_nasc_pac: data.data_nasc_pac ? formatDateForInput(data.data_nasc_pac) : '',
        peso_pac: data.peso_pac,
        alt_pac: data.alt_pac,
        tipo_sang: data.tipo_sang
      });
    });
    
    res.render('pacientes', { pacientes });
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Página para criar novo paciente
app.get('/criar', (req, res) => {
  res.render('criar');
});

// Criar novo paciente
app.post('/criar', async (req, res) => {
  try {
    const { nome_pac, data_nasc_pac, peso_pac, alt_pac, tipo_sang } = req.body;
    
    const novoPaciente = {
      nome_pac: nome_pac || '',
      data_nasc_pac: convertToTimestamp(data_nasc_pac),
      peso_pac: parseFloat(peso_pac) || 0,
      alt_pac: parseFloat(alt_pac) || 0,
      tipo_sang: tipo_sang || '',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await pacientesCollection.add(novoPaciente);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).send('Erro ao criar paciente');
  }
});

// Página para editar paciente
app.get('/editar/:id', async (req, res) => {
  try {
    const pacienteDoc = await pacientesCollection.doc(req.params.id).get();
    
    if (!pacienteDoc.exists) {
      return res.status(404).send('Paciente não encontrado');
    }
    
    const data = pacienteDoc.data();
    const paciente = {
      id: pacienteDoc.id,
      nome_pac: data.nome_pac,
      data_nasc_pac: data.data_nasc_pac ? formatDateForInput(data.data_nasc_pac) : '',
      peso_pac: data.peso_pac,
      alt_pac: data.alt_pac,
      tipo_sang: data.tipo_sang
    };
    
    res.render('editar', { paciente });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Atualizar paciente
app.post('/editar/:id', async (req, res) => {
  try {
    const { nome_pac, data_nasc_pac, peso_pac, alt_pac, tipo_sang } = req.body;
    
    const pacienteAtualizado = {
      nome_pac: nome_pac || '',
      data_nasc_pac: convertToTimestamp(data_nasc_pac),
      peso_pac: parseFloat(peso_pac) || 0,
      alt_pac: parseFloat(alt_pac) || 0,
      tipo_sang: tipo_sang || '',
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await pacientesCollection.doc(req.params.id).update(pacienteAtualizado);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).send('Erro ao atualizar paciente');
  }
});

// Deletar paciente (apenas POST, com confirm no frontend)
app.post('/deletar/:id', async (req, res) => {
  try {
    await pacientesCollection.doc(req.params.id).delete();
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).send('Erro ao deletar paciente');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
}); 