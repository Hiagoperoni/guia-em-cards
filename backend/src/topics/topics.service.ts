import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async create(subjectId: string, data: CreateTopicDto) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return this.prisma.topic.create({ data: { ...data, subjectId } });
  }

  async findBySubject(subjectId: string) {
    const topics = await this.prisma.topic.findMany({
      where: { subjectId, active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { cards: { where: { active: true } } } },
      },
    });
    return topics.map(({ _count, ...topic }) => ({
      ...topic,
      cardCount: _count.cards,
    }));
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: {
        _count: { select: { cards: { where: { active: true } } } },
      },
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    const { _count, ...rest } = topic;
    return { ...rest, cardCount: _count.cards };
  }

  async update(id: string, data: UpdateTopicDto) {
    await this.ensureExists(id);
    return this.prisma.topic.update({ where: { id }, data });
  }

  async archive(id: string) {
    await this.ensureExists(id);
    return this.prisma.topic.update({
      where: { id },
      data: { active: false },
    });
  }

  private async ensureExists(id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
  }
}
