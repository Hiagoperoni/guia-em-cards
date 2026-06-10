import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';
import { ResultType } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSessionDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
    });
    if (!topic || !topic.active) throw new NotFoundException('Topic not found');

    return this.prisma.studySession.create({
      data: { userId, topicId: dto.topicId },
    });
  }

  async finish(sessionId: string, userId: string, dto: FinishSessionDto) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();

    const totalCorrect = dto.results.filter(
      (r) => r.result === ResultType.CORRECT,
    ).length;
    const totalIncorrect = dto.results.filter(
      (r) => r.result === ResultType.INCORRECT,
    ).length;

    await this.prisma.cardResult.createMany({
      data: dto.results.map((r) => ({
        sessionId,
        cardId: r.cardId,
        result: r.result,
        timeSpentMs: r.timeSpentMs,
      })),
    });

    return this.prisma.studySession.update({
      where: { id: sessionId },
      data: {
        finishedAt: new Date(),
        totalCards: dto.results.length,
        totalCorrect,
        totalIncorrect,
      },
    });
  }

  async findOne(sessionId: string, userId: string) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        topic: { select: { id: true, name: true, subjectId: true } },
        results: { select: { cardId: true, result: true, timeSpentMs: true } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();
    return session;
  }

  findByUser(userId: string) {
    return this.prisma.studySession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        topicId: true,
        startedAt: true,
        finishedAt: true,
        totalCards: true,
        totalCorrect: true,
        totalIncorrect: true,
        topic: { select: { name: true } },
      },
    });
  }
}
