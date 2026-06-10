import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';

interface JwtRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  create(@Req() req: JwtRequest, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(req.user.userId, dto);
  }

  @Post(':id/finish')
  finish(
    @Req() req: JwtRequest,
    @Param('id') id: string,
    @Body() dto: FinishSessionDto,
  ) {
    return this.sessionsService.finish(id, req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: JwtRequest) {
    return this.sessionsService.findByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: JwtRequest, @Param('id') id: string) {
    return this.sessionsService.findOne(id, req.user.userId);
  }
}
