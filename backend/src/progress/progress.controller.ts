import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

interface JwtRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('me')
  getSummary(@Req() req: JwtRequest) {
    return this.progressService.getSummary(req.user.userId);
  }

  @Get('me/subjects')
  getSubjectProgress(@Req() req: JwtRequest) {
    return this.progressService.getSubjectProgress(req.user.userId);
  }
}
