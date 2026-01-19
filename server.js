import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rota para envio do formulário
app.post("/send", async (req, res) => {
  try {
    const { nome, whatsapp, valor, tipo } = req.body;

    if (!nome || !whatsapp || !valor || !tipo) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const mensagem = `📩 Novo contato
👤 Nome: ${nome}
📱 WhatsApp: ${whatsapp}
💰 Crédito: R$ ${valor}
📄 Tipo: ${tipo}`;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: mensagem,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao enviar mensagem ao Telegram");
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Servir o HTML principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
