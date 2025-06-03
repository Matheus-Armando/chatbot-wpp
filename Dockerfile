FROM node:18

WORKDIR /app

# Instalar Chrome para o Puppeteer
RUN apt-get update && apt-get install -y \
  chromium \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libatk1.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libpango-1.0-0 \
  libcairo2 \
  libjpeg-dev \
  libgif-dev

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o código do projeto
COPY . .

# Definir variável de ambiente para o Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# Iniciar o bot
CMD ["npm", "start"]