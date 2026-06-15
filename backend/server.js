require("dotenv").config();
const crypto = require("crypto");

const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")
      ? { rejectUnauthorized: false }
      : false,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function createId() {
  return crypto.randomUUID();
}

function mapUser(row) {
  return {
    firebaseId: row.firebase_id,
    nome: row.nome,
    email: row.email,
    id: row.id,
    foto: row.foto,
    pushToken: row.push_token,
    pushTokens: row.push_tokens || [],
  };
}

function mapEvent(row) {
  return {
    titulo: row.titulo,
    descricao: row.descricao,
    data: row.data,
    hora: row.hora,
    local: row.local,
    imagem: row.imagem,
    userId: row.user_id,
    createdAt: row.created_at,
    id: row.id,
  };
}

function mapNotification(row) {
  return {
    userId: row.user_id,
    eventId: row.event_id,
    tipo: row.tipo,
    titulo: row.titulo,
    mensagem: row.mensagem,
    detalhe: row.detalhe,
    lida: row.lida,
    createdAt: row.created_at,
    id: row.id,
  };
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firebase_id TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      foto TEXT,
      push_token TEXT,
      push_tokens JSONB NOT NULL DEFAULT '[]'::jsonb
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      hora TEXT NOT NULL,
      local TEXT NOT NULL,
      imagem TEXT,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_id TEXT,
      tipo TEXT NOT NULL,
      titulo TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      detalhe TEXT,
      lida BOOLEAN NOT NULL DEFAULT false,
      created_at TEXT NOT NULL
    );
  `);
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/users", async (req, res) => {
  try {
    const { firebaseId } = req.query;
    const result = firebaseId
      ? await pool.query("SELECT * FROM users WHERE firebase_id = $1", [
          firebaseId,
        ])
      : await pool.query("SELECT * FROM users ORDER BY nome");

    res.json(result.rows.map(mapUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { firebaseId, nome, email, foto = null } = req.body;

    if (!firebaseId || !nome || !email) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const result = await pool.query(
      `INSERT INTO users (id, firebase_id, nome, email, foto)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [createId(), firebaseId, nome, email, foto],
    );

    res.status(201).json(mapUser(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const currentResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);
    const current = currentResult.rows[0];

    if (!current) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const result = await pool.query(
      `UPDATE users
       SET nome = $1, foto = $2, push_token = $3, push_tokens = $4
       WHERE id = $5
       RETURNING *`,
      [
        req.body.nome ?? current.nome,
        req.body.foto ?? current.foto,
        req.body.pushToken ?? current.push_token,
        JSON.stringify(req.body.pushTokens ?? current.push_tokens ?? []),
        req.params.id,
      ],
    );

    res.json(mapUser(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = userId
      ? await pool.query(
          "SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC",
          [userId],
        )
      : await pool.query("SELECT * FROM events ORDER BY created_at DESC");

    res.json(result.rows.map(mapEvent));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

app.post("/events", async (req, res) => {
  try {
    const { titulo, descricao, data, hora, local, imagem = null, userId } = req.body;
    const createdAt = req.body.createdAt || new Date().toISOString();

    if (!titulo || !descricao || !data || !hora || !local || !userId) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const result = await pool.query(
      `INSERT INTO events
       (id, titulo, descricao, data, hora, local, imagem, user_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        createId(),
        titulo,
        descricao,
        data,
        hora,
        local,
        imagem,
        userId,
        createdAt,
      ],
    );

    res.status(201).json(mapEvent(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar evento" });
  }
});

app.put("/events/:id", async (req, res) => {
  try {
    const { titulo, descricao, data, hora, local, imagem = null, userId } = req.body;
    const createdAt = req.body.createdAt || new Date().toISOString();

    if (!titulo || !descricao || !data || !hora || !local || !userId) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const result = await pool.query(
      `UPDATE events
       SET titulo = $1, descricao = $2, data = $3, hora = $4, local = $5,
           imagem = $6, user_id = $7, created_at = $8
       WHERE id = $9
       RETURNING *`,
      [
        titulo,
        descricao,
        data,
        hora,
        local,
        imagem,
        userId,
        createdAt,
        req.params.id,
      ],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(mapEvent(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
});

app.delete("/events/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [
      req.params.id,
    ]);

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(mapEvent(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir evento" });
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const { userId } = req.query;
    const result = userId
      ? await pool.query(
          "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
          [userId],
        )
      : await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");

    res.json(result.rows.map(mapNotification));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar notificações" });
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const {
      userId,
      eventId = null,
      tipo,
      titulo,
      mensagem,
      detalhe = null,
      lida = false,
    } = req.body;
    const createdAt = req.body.createdAt || new Date().toISOString();

    if (!userId || !tipo || !titulo || !mensagem) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const result = await pool.query(
      `INSERT INTO notifications
       (id, user_id, event_id, tipo, titulo, mensagem, detalhe, lida, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        createId(),
        userId,
        eventId,
        tipo,
        titulo,
        mensagem,
        detalhe,
        lida,
        createdAt,
      ],
    );

    res.status(201).json(mapNotification(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar notificação" });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }

    res.json(mapNotification(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir notificação" });
  }
});

app.get("/images", async (req, res) => {
  const { tag = "eventAds" } = req.query;

  try {
    const result = await cloudinary.api.resources_by_tag(tag, {
      type: "upload",
      prefix: "",
      max_results: 100,
    });

    res.json(result.resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "public_id é obrigatório" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar imagem" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
