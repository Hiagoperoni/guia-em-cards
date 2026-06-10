import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateSubjectDto) {
    return this.prisma.subject.create({ data });
  }

  async findAll() {
    const subjects = await this.prisma.subject.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { topics: { where: { active: true } } } },
      },
    });
    return subjects.map(({ _count, ...subject }) => ({
      ...subject,
      topicCount: _count.topics,
    }));
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        topics: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }

  async update(id: string, data: UpdateSubjectDto) {
    await this.ensureExists(id);
    return this.prisma.subject.update({ where: { id }, data });
  }

  async archive(id: string) {
    await this.ensureExists(id);
    return this.prisma.subject.update({
      where: { id },
      data: { active: false },
    });
  }

  private async ensureExists(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
  }
}
