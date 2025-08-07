import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../common/jwt-auth/jwt-auth.guard';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressService } from './progress.service';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getProgress(@Req() req: Request) {
    const { userId } = req.user as { userId: string };
    return this.progressService.getProgress(new Types.ObjectId(userId));
  }

  @Post('update')
  async updateProgress(
    @Req() req: Request,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    const { userId } = req.user as { userId: string };
    return this.progressService.updateProgress(
      new Types.ObjectId(userId),
      updateProgressDto,
    );
  }
}
