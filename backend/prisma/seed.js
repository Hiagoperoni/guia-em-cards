"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@guiaemcards.com' },
        update: {},
        create: {
            email: 'admin@guiaemcards.com',
            name: 'Admin',
            password: adminPassword,
            role: client_1.Role.ADMIN,
        },
    });
    console.log('Admin created:', admin.email);
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
    const respostas = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'respostas.json'), 'utf-8'));
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
                glossary: r.glossario.map((g) => ({
                    name: g.conceito,
                    explanation: g.explicacao,
                })),
            },
        });
        console.log(`  [${order}/${respostas.length}] ${r.pergunta.substring(0, 60)}...`);
    }
    for (const card of mathCards) {
        const { topicId, ...rest } = card;
        await prisma.card.upsert({ where: { id: card.id }, update: {}, create: { ...rest, topicId } });
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
//# sourceMappingURL=seed.js.map