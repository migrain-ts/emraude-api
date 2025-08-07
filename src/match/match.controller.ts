import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth/jwt-auth.guard';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createMatch(@Req() req, @Body() createMatchDto: CreateMatchDto) {
    const player1Id = req.user.userId;
    const { player2Id } = createMatchDto;
    return this.matchService.createMatch(player1Id, player2Id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMatch(@Param('id') id: string) {
    return this.matchService.getMatchById(id);
  }

  @Post(':id/result')
  @UseGuards(JwtAuthGuard)
  async setMatchResult(
    @Param('id') id: string,
    @Body() matchResultDto: MatchResultDto,
  ) {
    const { winnerId } = matchResultDto;
    return this.matchService.setMatchResult(id, winnerId);
  }
}
