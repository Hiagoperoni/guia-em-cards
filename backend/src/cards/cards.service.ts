import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(topicId: string, data: CreateCardDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    const { glossary, ...rest } = data;
    return this.prisma.card.create({
      data: {
        ...rest,
        topicId,
        glossary: glossary as unknown as Prisma.InputJsonValue | undefined,
      },
    });
  }

  findByTopic(topicId: string) {
    return this.prisma.card.findMany({
      where: { topicId, active: true },
      orderBy: { order: 'asc' },
      select: { id: true, question: true, order: true },
    });
  }

  async findOne(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return card;
  }

  async update(id: string, data: UpdateCardDto) {
    await this.ensureExists(id);
    const { glossary, ...rest } = data;
    return this.prisma.card.update({
      where: { id },
      data: {
        ...rest,
        ...(glossary !== undefined
          ? { glossary: glossary as unknown as Prisma.InputJsonValue }
          : {}),
      },
    });
  }

  async archive(id: string) {
    await this.ensureExists(id);
    return this.prisma.card.update({
      where: { id },
      data: { active: false },
    });
  }

  private async ensureExists(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
  }
}
