import { createCanvas, loadImage } from 'canvas';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

interface UnsplashResponse {
    urls: {
        regular: string;
    };
}

interface ImageGeneratorOptions {
    category?: string;
    width?: number;
    height?: number;
    quality?: number;
}

async function getImageUrl({ category, width = 800, height = 400 }: ImageGeneratorOptions = {}): Promise<string> {
    try {
        if (category && process.env.UNSPLASH_ACCESS_KEY) {        
            const fetch = (await import('node-fetch')).default;
            const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${encodeURIComponent(category)}`;
            
            const headers = {
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            };

            const response = await fetch(url, { headers });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro detalhado:', errorText);
                throw new Error(`Erro na API Unsplash: ${response.status} - ${errorText}`);
            }

            const data = await response.json() as UnsplashResponse;
            return data.urls.regular;
        }
        
        console.log('Usando Picsum como fallback...');
        return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    } catch (error) {
        return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    }
}

async function generateImage(options?: ImageGeneratorOptions): Promise<Buffer> {
    try {
        const imageUrl = await getImageUrl(options);
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao baixar imagem: ${response.status}`);
        }

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

//esta função não tem um cunho racista, é apenas um brincadeira com o nome do usuário
// eh o nome do personagem de um anime(One Piece), que é o personagem principal chamado de Monkey D. Luffy,
// e o nome do usuário é Lk D Amaterasu, então é uma brincadeira com o nome dele cujo o mesmo pediu para ser feita, 
// esta função é apenas uma brincadeira enquanto testo o bot e sera retirado ao projeto ser lançado
async function generateSpecialLk(): Promise<Buffer> {
    try {

        const monkeyTerms = [
            'monkey primate',
            'macaque',
            'monkey face',
            'primate monkey',
            'monkey portrait'
        ];

        const randomTerm = monkeyTerms[Math.floor(Math.random() * monkeyTerms.length)];
        
        const imageUrl = await getImageUrl({ 
            category: randomTerm,
            width: 800, 
            height: 400 
        });

        const fetch = (await import('node-fetch')).default;
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao baixar imagem: ${response.status}`);
        }

        const imageBuffer = await response.arrayBuffer();
        const background = await loadImage(Buffer.from(imageBuffer));

        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, 800, 400);

        ctx.shadowColor = 'rgb(139, 69, 19)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';

        ctx.fillText('Lk D Amaterasu', 400, 350);

        return canvas.toBuffer('image/jpeg');
    } catch (error) {
        console.error('Erro ao gerar imagem especial:', error);
        throw error;
    }
}

export { generateImage as default, generateSpecialLk };