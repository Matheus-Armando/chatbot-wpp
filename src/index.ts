import { Client, LocalAuth, Message, MessageMedia } from 'whatsapp-web.js';
import generateImage from './utils/imageGenerator';
import { getAllCommands, getFaqAnswer, getFaqByCategory } from './utils/faq';

const messageDelay = 1000;
const maxMessagesPerHour = 100;
let messageCount = 0;
let lastMessageTime = 0;

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-session"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
const qrcode = require('qrcode-terminal');

client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot está online! Envie !ping para testar.');
});

// Listener para mensagens
client.on('message', async (message: Message) => {

    const now = Date.now();

    const isMentioned = await message.getMentions().then(mentions => 
        mentions.some(mention => mention.id._serialized === client.info.wid._serialized)
    );

    if (isMentioned) {
        const chat = await message.getChat();
        const isGroup = chat.isGroup;
        
        if (isGroup) {
            await message.reply('Olá! Me mencionou? Use !ajuda para ver meus comandos 😊');
        } else {
            await message.reply('Oi! Você pode digitar seus comandos diretamente, sem precisar me mencionar 😉');
        }
        return;
    }

    const chat = await message.getChat();
    if (!chat.isGroup && !message.body.startsWith('!')) {
        await message.reply(
            'Olá! 👋 Sou um bot de ajuda.\n\n' +
            'Para ver todos os comandos disponíveis, envie *!ajuda*\n\n' +
            'Você também pode ver comandos por categoria:\n' +
            '🔰 *!basico* - Comandos básicos do WhatsApp\n' +
            '🔄 *!intermediario* - Recursos intermediários\n' +
            '⚡ *!avancado* - Funções avançadas\n\n' +
            'Outros comados:\n' +
            '🏓 *!ping* - Testar conexão\n' +
            '🌅 *!bomdia* - Mensagem de bom dia _Esta função ainda esta em desenvolvimento_\n\n' +
            '_Use ! no início de cada comando_'
        );
        return;
    }

    if (now - lastMessageTime < messageDelay) {
        console.log('Aguardando delay entre mensagens...');
        return;
    }

    if (messageCount >= maxMessagesPerHour) {
        console.log('Limite de mensagens por hora atingido');
        return;
    }

    lastMessageTime = now;
    messageCount++;

    setTimeout(() => {
        messageCount = 0;
    }, 3600000);

    if (message.body === '!ping') {
        message.reply('pong');
    }

    if (message.body === '!bomdia') {
        const imageBuffer = await generateImage();
        const media = new MessageMedia('image/png', imageBuffer.toString('base64'));
        await message.reply(media, undefined, { caption: 'Bom dia!' });
    }

    const faqAnswer = getFaqAnswer(message.body);
    if (faqAnswer) {
        message.reply(faqAnswer);
        return;
    }

    // Listar todos os comandos
    if (message.body === '!ajuda') {
        message.reply(getAllCommands());
        return;
    }

    // Listar por categoria
    if (message.body === '!basico') {
        message.reply(getFaqByCategory('básico'));
    }

    if (message.body === '!intermediario') {
        message.reply(getFaqByCategory('intermediário'));
    }

    if (message.body === '!avancado') {
        message.reply(getFaqByCategory('avançado'));
    }

});

client.initialize();