import { createCanvas, loadImage } from 'canvas';
import moment from 'moment';

async function generateImage(): Promise<Buffer> {
    try {
        const fetch = (await import('node-fetch')).default;
        const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
        const response = await fetch(imageUrl);
        const imageBuffer = await response.arrayBuffer();
        const background = await loadImage(Buffer.from(imageBuffer));

        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, 800, 400);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';

        ctx.fillText('Bom dia!', 400, 100);
        
        ctx.font = '32px Arial';
        const day = moment().format('dddd');
        ctx.fillText(`Tenha ${day === 'sábado' || day === 'domingo' ? 'um ótimo' : 'uma ótima'} ${day}!`, 400, 200);

        return canvas.toBuffer('image/jpeg');
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        throw error;
    }
}

export default generateImage;