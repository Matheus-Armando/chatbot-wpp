import {
  Client,
  LocalAuth,
  Message,
  MessageMedia,
  Buttons,
} from "whatsapp-web.js";
import generateImage, { generateSpecialLk } from "./utils/imageGenerator";
import { getAllCommands, getFaqAnswer, getFaqByCategory } from "./utils/faq";

const CONFIG = {
  messageDelay: 2000,
  maxMessagesPerHour: 500,
  resetInterval: 3600000,
};

let messageCount = 0;
let lastMessageTime = 0;

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "bot-session",
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

async function handleMediaMessage(message: Message, type: "bomdia" | "lk") {
  try {
    const imageBuffer =
      type === "lk"
        ? await generateSpecialLk()
        : await generateImage({
            category: message.body.split(" ")[1],
            width: 800,
            height: 400,
          });

    const media = new MessageMedia(
      "image/jpeg",
      imageBuffer.toString("base64")
    );
    await message.reply(media, undefined, {
      caption: type === "lk" ? "🐒 Lk D Amaterasu 🙈" : "🌅 Bom dia!",
    });
  } catch (error) {
    console.error(`Erro ao gerar ${type}:`, error);
    await message.reply(
      `Desculpe, não consegui gerar a imagem de ${type}. Tente novamente!`
    );
  }
}

async function sendMainMenu(message: Message) {
  try {
    await message.reply(
      "👋 Olá! Como posso ajudar?\n\n" +
        "📱 *Menu de Comandos:*\n\n" +
        "🔰 !basico - Comandos básicos\n" +
        "🔄 !intermediario - Recursos intermediários\n" +
        "⭐ !avancado - Funções avançadas\n" +
        "🌅 !bomdia - Mensagem de bom dia\n" +
        "❓ !ajuda - Ver todos os comandos\n" +
        "🏓 !ping - Testar conexão"
    );
  } catch (error) {
    console.error("Erro ao enviar menu:", error);
    await message.reply("❌ Erro ao exibir o menu. Tente novamente!");
  }
}

async function handleCategoryCommand(
  message: Message,
  category: "básico" | "intermediário" | "avançado"
) {
  await message.reply(getFaqByCategory(category));
}

const qrcode = require("qrcode-terminal");

client.on("qr", (qr) => {
  console.log("Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qr
  )}`;
  console.log("\n\n==== LINK PARA QR CODE ====");
  console.log(qrCodeUrl);
  console.log("============================\n\n");
});

client.on("ready", () => {
  console.log("Bot está online! Envie !ping para testar.");
});

client.on("message", async (message: Message) => {
  try {
    const now = Date.now();
    if (now - lastMessageTime < CONFIG.messageDelay) {
      console.log("Rate limiting aplicado");
      return;
    }

    if (messageCount >= CONFIG.maxMessagesPerHour) {
      console.log("Limite horário atingido");
      return;
    }

    lastMessageTime = now;
    messageCount++;

    setTimeout(() => (messageCount = 0), CONFIG.resetInterval);

    const chat = await message.getChat();

    const faqAnswer = getFaqAnswer(message.body);
    if (faqAnswer) {
      await message.reply(faqAnswer);
      return;
    }

    switch (message.body.toLowerCase()) {
      case "!ping":
        await message.reply("🏓 pong!");
        break;
      case "!ajuda":
        await message.reply(getAllCommands());
        break;
      case "!basico":
        await handleCategoryCommand(message, "básico");
        break;
      case "!intermediario":
        await handleCategoryCommand(message, "intermediário");
        break;
      case "!avancado":
        await handleCategoryCommand(message, "avançado");
        break;
      case "!lk":
        await handleMediaMessage(message, "lk");
        break;
    }

    if (!chat.isGroup && !message.body.startsWith("!")) {
      await sendMainMenu(message);
      return;
    }

    if (message.body.startsWith("!bomdia")) {
      await handleMediaMessage(message, "bomdia");
      return;
    }
  } catch (error) {
    console.error("Erro no processamento da mensagem:", error);
    await message.reply("Ops! Ocorreu um erro ao processar sua mensagem.");
  }
});

client.initialize();
