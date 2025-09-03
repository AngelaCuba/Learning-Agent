import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { QuestionRepositoryPort } from '../../domain/ports/question-repository.port';
import { Question } from '../../domain/entities/question.entity';

@Injectable()
export class PrismaQuestionRepositoryAdapter implements QuestionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(question: Question): Promise<Question> {
    const created = await this.prisma.question.create({
      data: {
        id: question.id,
        text: question.text,
        options: question.options,
        source: question.source,
        confidence: question.confidence,
        status: question.status,
        createdAt: question.createdAt,
      },
    });

    return new Question(
      created.text,
      created.options,
      created.source ?? undefined,
      created.confidence ?? undefined,
      created.status as any
    );
  }

  async findById(id: string): Promise<Question | null> {
    const found = await this.prisma.question.findUnique({ where: { id } });
    return found
      ? new Question(
          found.text,
          found.options,
          found.source ?? undefined,
          found.confidence ?? undefined,
          found.status as any
        )
      : null;
  }

  async findAll(): Promise<Question[]> {
    const all = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return all.map(
      q =>
        new Question(
          q.text,
          q.options,
          q.source ?? undefined,
          q.confidence ?? undefined,
          q.status as any
        )
    );
  }

  async findByStatus(status: string, limit = 10, offset = 0): Promise<Question[]> {
    const all = await this.prisma.question.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return all.map(
      q =>
        new Question(
          q.text,
          q.options,
          q.source ?? undefined,
          q.confidence ?? undefined,
          q.status as any
        )
    );
  }
}
