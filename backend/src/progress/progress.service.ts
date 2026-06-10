import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const agg = await this.prisma.studySession.aggregate({
      where: { userId, finishedAt: { not: null } },
      _count: { id: true },
      _sum: { totalCards: true, totalCorrect: true },
    });

    // Count distinct subjects studied
    const finishedSessions = await this.prisma.studySession.findMany({
      where: { userId, finishedAt: { not: null } },
      select: { topic: { select: { subjectId: true } } },
    });
    const distinctSubjects = new Set(
      finishedSessions.map((s) => s.topic.subjectId),
    );

    const totalCards = agg._sum.totalCards ?? 0;
    const totalCorrect = agg._sum.totalCorrect ?? 0;

    return {
      totalSessions: agg._count.id,
      totalSubjectsStudied: distinctSubjects.size,
      totalCardsStudied: totalCards,
      overallAccuracy: totalCards > 0 ? totalCorrect / totalCards : 0,
    };
  }

  async getSubjectProgress(userId: string) {
    const sessions = await this.prisma.studySession.findMany({
      where: { userId, finishedAt: { not: null } },
      orderBy: { startedAt: 'desc' },
      include: {
        topic: {
          select: {
            subjectId: true,
            subject: { select: { id: true, name: true, color: true, icon: true } },
          },
        },
      },
    });

    // Aggregate per subject in JS
    type SubjectAgg = {
      subjectId: string;
      subjectName: string;
      subjectColor: string;
      subjectIcon: string;
      sessionsCount: number;
      lastSessionAt: string;
      lastSessionCorrect: number;
      lastSessionCards: number;
      totalCards: number;
      totalCorrect: number;
    };

    const map = new Map<string, SubjectAgg>();

    for (const s of sessions) {
      const { subjectId, subject } = s.topic;
      if (!map.has(subjectId)) {
        map.set(subjectId, {
          subjectId,
          subjectName: subject.name,
          subjectColor: subject.color,
          subjectIcon: subject.icon,
          sessionsCount: 0,
          lastSessionAt: s.finishedAt!.toISOString(),
          lastSessionCorrect: s.totalCorrect,
          lastSessionCards: s.totalCards,
          totalCards: 0,
          totalCorrect: 0,
        });
      }
      const agg = map.get(subjectId)!;
      agg.sessionsCount++;
      agg.totalCards += s.totalCards;
      agg.totalCorrect += s.totalCorrect;
    }

    return Array.from(map.values()).map((a) => ({
      subjectId: a.subjectId,
      subjectName: a.subjectName,
      subjectColor: a.subjectColor,
      subjectIcon: a.subjectIcon,
      sessionsCount: a.sessionsCount,
      lastSessionAt: a.lastSessionAt,
      lastSessionAccuracy:
        a.lastSessionCards > 0 ? a.lastSessionCorrect / a.lastSessionCards : 0,
      overallAccuracy: a.totalCards > 0 ? a.totalCorrect / a.totalCards : 0,
      totalCardsStudied: a.totalCards,
    }));
  }
}
