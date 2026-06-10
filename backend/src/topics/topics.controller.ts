import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TopicsService } from './topics.service';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CardsService } from '../cards/cards.service';
import { CreateCardDto } from '../cards/dto/create-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(
    private topicsService: TopicsService,
    private cardsService: CardsService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  archive(@Param('id') id: string) {
    return this.topicsService.archive(id);
  }

  @Get(':id/cards')
  findCards(@Param('id') id: string) {
    return this.cardsService.findByTopic(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/cards')
  createCard(@Param('id') id: string, @Body() dto: CreateCardDto) {
    return this.cardsService.create(id, dto);
  }
}
