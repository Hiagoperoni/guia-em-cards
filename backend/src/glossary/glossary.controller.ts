import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GlossaryService } from './glossary.service';

@UseGuards(JwtAuthGuard)
@Controller('glossary')
export class GlossaryController {
  constructor(private glossaryService: GlossaryService) {}

  @Get()
  getGrouped() {
    return this.glossaryService.getGrouped();
  }
}
