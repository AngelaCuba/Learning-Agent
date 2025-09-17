import { Injectable } from '@nestjs/common';
import { PrismaReinforcementRepository } from './persistenceC/prisma-reinforcement-repository.adapter';

@Injectable()
export class ReinforcementProgressService {
  constructor(private readonly repo: PrismaReinforcementRepository) {}

  async saveProgress(studentId: string, courseId: string, score: number, maxScore?: number) {
    return this.repo.createProgress(studentId, courseId, score, maxScore);
  }

  async getProgress(studentId: string, courseId: string) {
    const records = await this.repo.getProgressByStudentAndCourse(studentId, courseId);
    if (!records || records.length === 0) {
      return {
        subjectName: 'N/A',
        lastExamDate: 'N/A',
        successRate: 0,
        lastExamScore: 0,
        trendData: [],
      };
    }

    const trend = records.map(r => Math.round(r.successRate));
    const last = records[0];

    return {
      subjectName: last.course?.name || 'N/A',
      lastExamDate: last.createdAt ? last.createdAt.toISOString().split('T')[0] : 'N/A',
      successRate: trend.length ? Math.round(trend.reduce((a, b) => a + b, 0) / trend.length) : 0,
      lastExamScore: last.successRate ?? 0,
      trendData: trend,
    };
  }
}
