import { Client, Message } from 'whatsapp-web.js';

const client = new Client({});
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
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

client.initialize();