import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaReinforcementRepository {
  async createProgress(studentId: string, courseId: string, score: number, maxScore?: number) {
    const m = typeof maxScore === 'number' && maxScore > 0 ? maxScore : 100;
    const successRate = Math.round((score / m) * 100);

    return prisma.reinforcementProgress.create({
      data: {
        studentId,
        courseId,
        score,
        maxScore: m,
        successRate,
      },
    });
  }

  async getProgressByStudentAndCourse(studentId: string, courseId: string) {
    return prisma.reinforcementProgress.findMany({
      where: { studentId, courseId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllProgressForStudent(studentId: string) {
    return prisma.reinforcementProgress.findMany({
      where: { studentId },
      include: { course: true },
    });
  }
}
