import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type RawCard = {
  pergunta: string;
  respostaCard: string;
  resumoExplicacao: string;
  dificuldade?: string;
  opcoes?: string[];
  glossario: Array<{ conceito: string; explicacao: string }>;
};

// Remove accidental duplicate questions while keeping every unique card.
function dedupeByQuestion(cards: RawCard[]): RawCard[] {
  const seen = new Set<string>();
  const result: RawCard[] = [];
  for (const c of cards) {
    if (seen.has(c.pergunta)) continue;
    seen.add(c.pergunta);
    result.push(c);
  }
  return result;
}

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@guiaemcards.com' },
    update: {},
    create: {
      email: 'admin@guiaemcards.com',
      name: 'Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin created:', admin.email);

  // --- Matemática ---
  const math = await prisma.subject.upsert({
    where: { id: 'math-subject' },
    update: {},
    create: { id: 'math-subject', name: 'Matemática', description: 'Cálculos, fórmulas e lógica.', color: '#ef4444', icon: '📐' },
  });

  const geom = await prisma.topic.upsert({
    where: { id: 'math-topic-geom' },
    update: {},
    create: { id: 'math-topic-geom', name: 'Geometria', description: 'Formas, áreas e volumes.', order: 1, subjectId: math.id },
  });

  const calc = await prisma.topic.upsert({
    where: { id: 'math-topic-calc' },
    update: {},
    create: { id: 'math-topic-calc', name: 'Cálculo', description: 'Derivadas e integrais.', order: 2, subjectId: math.id },
  });

  const mathCards = [
    { id: 'math-card-1', topicId: geom.id, order: 1, question: 'O que é a constante $\\pi$?', answer: 'A razão entre a circunferência de um círculo e seu diâmetro.', summary: 'Aproximadamente 3,14159 — número irracional.' },
    { id: 'math-card-2', topicId: geom.id, order: 2, question: 'Qual a fórmula da área do círculo?', answer: '$A = \\pi r^2$', summary: 'Onde $r$ é o raio.' },
    { id: 'math-card-3', topicId: geom.id, order: 3, question: 'O que diz o Teorema de Pitágoras?', answer: '$a^2 + b^2 = c^2$', summary: 'Válido para triângulos retângulos.' },
    { id: 'math-card-4', topicId: calc.id, order: 1, question: 'Qual a derivada de $x^n$?', answer: '$nx^{n-1}$', summary: 'Regra da potência.' },
    { id: 'math-card-5', topicId: calc.id, order: 2, question: 'O que é a integral de $1/x$?', answer: '$\\ln|x| + C$', summary: 'Logaritmo natural.' },
  ];

  // --- Biologia ---
  const bio = await prisma.subject.upsert({
    where: { id: 'bio-subject' },
    update: {},
    create: { id: 'bio-subject', name: 'Biologia', description: 'Estudo da vida e organismos.', color: '#22c55e', icon: '🧬' },
  });

  const cell = await prisma.topic.upsert({
    where: { id: 'bio-topic-cell' },
    update: {},
    create: { id: 'bio-topic-cell', name: 'Célula', description: 'Estrutura e função celular.', order: 1, subjectId: bio.id },
  });

  // --- Bio cards: load from respostas.json and overwrite (skip if file is absent) ---
  const respostasPath = path.join(__dirname, '..', '..', '.specs', 'docs-aux', 'respostas.json');
  if (fs.existsSync(respostasPath)) {
    const rawRespostas: RawCard[] = JSON.parse(fs.readFileSync(respostasPath, 'utf-8'));
    const respostas = dedupeByQuestion(rawRespostas);

    // Delete existing bio cards so data is fully overwritten.
    // Must remove CardResult rows first (FK RESTRICT on cardId).
    const existingBioCards = await prisma.card.findMany({
      where: { topicId: cell.id },
      select: { id: true },
    });
    const existingBioIds = existingBioCards.map((c) => c.id);
    if (existingBioIds.length > 0) {
      await prisma.cardResult.deleteMany({ where: { cardId: { in: existingBioIds } } });
    }
    await prisma.card.deleteMany({ where: { topicId: cell.id } });
    console.log('Existing bio cards (and their results) deleted.');

    for (let i = 0; i < respostas.length; i++) {
      const r = respostas[i];
      const order = i + 1;
      const id = `bio-c-${String(order).padStart(2, '0')}`;
      await prisma.card.create({
        data: {
          id,
          topicId: cell.id,
          order,
          question: r.pergunta,
          answer: r.respostaCard,
          summary: r.resumoExplicacao,
          difficulty: r.dificuldade,
          options: r.opcoes as unknown as any,
          glossary: r.glossario.map((g) => ({
            name: g.conceito,
            explanation: g.explicacao,
          })) as unknown as any,
        },
      });
      console.log(`  [${order}/${respostas.length}] ${r.pergunta.substring(0, 60)}...`);
    }
  } else {
    console.warn('respostas.json not found — skipping bio cards (existing bio cards kept).');
  }

  for (const card of mathCards) {
    const { topicId, ...rest } = card;
    await prisma.card.upsert({ where: { id: card.id }, update: {}, create: { ...rest, topicId } });
  }

  // --- Geometria: Triângulos (load from geometria-1.json) ---
  const geometria = await prisma.subject.upsert({
    where: { id: 'geometria-subject' },
    update: {},
    create: { id: 'geometria-subject', name: 'Geometria', description: 'Triângulos, ângulos e relações métricas.', color: '#3b82f6', icon: '📐' },
  });

  const triangulos = await prisma.topic.upsert({
    where: { id: 'geom-topic-triangulos' },
    update: {},
    create: { id: 'geom-topic-triangulos', name: 'Triângulos', description: 'Triângulo retângulo, Pitágoras e trigonometria.', order: 1, subjectId: geometria.id },
  });

  const geometriaPath = path.join(__dirname, '..', '..', '.specs', 'docs-aux', 'geometria-1.json');
  if (fs.existsSync(geometriaPath)) {
    const rawGeometriaCards: RawCard[] = JSON.parse(fs.readFileSync(geometriaPath, 'utf-8'));
    const geometriaCards = dedupeByQuestion(rawGeometriaCards);

    // Delete existing geometry cards so data is fully overwritten.
    const existingGeomCards = await prisma.card.findMany({
      where: { topicId: triangulos.id },
      select: { id: true },
    });
    const existingGeomIds = existingGeomCards.map((c) => c.id);
    if (existingGeomIds.length > 0) {
      await prisma.cardResult.deleteMany({ where: { cardId: { in: existingGeomIds } } });
    }
    await prisma.card.deleteMany({ where: { topicId: triangulos.id } });
    console.log('Existing geometry cards (and their results) deleted.');

    for (let i = 0; i < geometriaCards.length; i++) {
      const r = geometriaCards[i];
      const order = i + 1;
      const id = `geom-tri-${String(order).padStart(2, '0')}`;
      await prisma.card.create({
        data: {
          id,
          topicId: triangulos.id,
          order,
          question: r.pergunta,
          answer: r.respostaCard,
          summary: r.resumoExplicacao,
          difficulty: r.dificuldade,
          options: r.opcoes as unknown as any,
          glossary: r.glossario.map((g) => ({
            name: g.conceito,
            explanation: g.explicacao,
          })) as unknown as any,
        },
      });
      console.log(`  [geom ${order}/${geometriaCards.length}] ${r.pergunta.substring(0, 60)}...`);
    }
  } else {
    console.warn('geometria-1.json not found — skipping geometry cards.');
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
