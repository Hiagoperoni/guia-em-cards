import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface GlossaryItem {
  name: string;
  explanation: string;
}

@Injectable()
export class GlossaryService {
  constructor(private prisma: PrismaService) {}

  // Returns all glossary terms grouped by subject -> topic.
  async getGrouped() {
    const subjects = await this.prisma.subject.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        topics: {
          where: { active: true },
          orderBy: { order: 'asc' },
          include: {
            cards: {
              where: { active: true },
              orderBy: { order: 'asc' },
              select: { id: true, question: true, glossary: true },
            },
          },
        },
      },
    });

    return subjects
      .map((subject) => ({
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        subjectIcon: subject.icon,
        topics: subject.topics
          .map((topic) => ({
            topicId: topic.id,
            topicName: topic.name,
            terms: topic.cards.flatMap((card) =>
              this.normalize(card.glossary).map((item) => ({
                name: item.name,
                explanation: item.explanation,
                cardId: card.id,
                question: card.question,
              })),
            ),
          }))
          .filter((topic) => topic.terms.length > 0),
      }))
      .filter((subject) => subject.topics.length > 0);
  }

  private normalize(value: unknown): GlossaryItem[] {
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is GlossaryItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as GlossaryItem).name === 'string' &&
        typeof (item as GlossaryItem).explanation === 'string',
    );
  }
}
