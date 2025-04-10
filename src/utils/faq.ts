interface FaqItem {
  command: string;
  question: string;
  answer: string;
  category: 'básico' | 'intermediário' | 'avançado';
}

const faqList: FaqItem[] = [
  {
      command: '!audio',
      question: 'Como enviar mensagem de áudio?',
      answer: 'Para gravar um áudio, pressione e segure o ícone do microfone. Para enviar, solte o botão. Para cancelar, arraste para o lado.',
      category: 'básico'
  },
  {
      command: '!foto',
      question: 'Como enviar fotos?',
      answer: 'Clique no ícone de clipe (📎) e selecione "Galeria" ou "Câmera" para enviar uma foto.',
      category: 'básico'
  },
  {
      command: '!grupo',
      question: 'Como criar um grupo?',
      answer: 'Clique nos 3 pontos > "Novo grupo" > Selecione os participantes > Digite o nome do grupo > Clique em ✓',
      category: 'intermediário'
  },
  {
      command: '!status',
      question: 'Como postar um status?',
      answer: 'Vá para a aba "Status" > Toque em "Meu status" > Escolha foto ou texto > Compartilhe',
      category: 'intermediário'
  },
  {
      command: '!backup',
      question: 'Como fazer backup das conversas?',
      answer: 'Configurações > Conversas > Backup de conversas > FAZER BACKUP',
      category: 'avançado'
  },
  {
      command: '!privacidade',
      question: 'Como configurar privacidade?',
      answer: 'Configurações > Conta > Privacidade. Aqui você pode configurar quem vê: última vez, foto, status e mais.',
      category: 'avançado'
  }
];

export function getFaqAnswer(command: string): string | null {
  const faq = faqList.find(item => item.command === command);
  return faq ? `📱 *${faq.question}*\n\n${faq.answer}` : null;
}

export function getAllCommands(): string {
  return `*Comandos disponíveis:*\n\n${faqList
      .map(item => `${item.command} - ${item.question}`)
      .join('\n')}`;
}

export function getFaqByCategory(category: 'básico' | 'intermediário' | 'avançado'): string {
  const filteredFaq = faqList.filter(item => item.category === category);
  return `*Dúvidas ${category}:*\n\n${filteredFaq
      .map(item => `${item.command} - ${item.question}`)
      .join('\n')}`;
}

export default {
  getFaqAnswer,
  getAllCommands,
  getFaqByCategory
};