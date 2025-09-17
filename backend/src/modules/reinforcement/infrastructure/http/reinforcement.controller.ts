import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReinforcementProgressService } from '../reinforcement-progress.service';

@Controller('reinforcement')
export class ReinforcementController {
  constructor(private readonly reinforcementService: ReinforcementProgressService) {}

  @Post('progress')
  async saveProgress(@Body() body: { studentId: string; courseId: string; score: number; maxScore?: number }) {
    const { studentId, courseId, score, maxScore } = body;
    const result = await this.reinforcementService.saveProgress(studentId, courseId, score, maxScore);
    return { success: true, data: result };
  }

  @Get('progress/:courseId')
  async getProgress(@Param('courseId') courseId: string, @Query('studentId') studentId?: string) {
    if (!studentId) {
      return { success: false, message: 'studentId query param required' };
    }
    const result = await this.reinforcementService.getProgress(studentId, courseId);
    return { success: true, data: result };
  }
}
