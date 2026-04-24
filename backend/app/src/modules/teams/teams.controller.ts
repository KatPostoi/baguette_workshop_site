import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AdminTeamFilterDto } from './dto/admin-team-filter.dto';
import { parseOptionalBooleanQuery } from '../../common/query/parse-optional-boolean-query';

@Controller('admin/teams')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  list(
    @Query() filters: AdminTeamFilterDto,
    @Query('active') activeRaw?: string,
    @Query('includeInactive') includeInactiveRaw?: string,
  ) {
    return this.teamsService.list({
      search: filters.search,
      active: this.parseActivity(activeRaw, includeInactiveRaw),
    });
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamsService.deactivate(id);
  }

  private parseActivity(
    activeValue?: string,
    includeInactiveValue?: string,
  ): boolean | undefined {
    const active = parseOptionalBooleanQuery('active', activeValue);

    if (active !== undefined) {
      return active;
    }

    const includeInactive = parseOptionalBooleanQuery(
      'includeInactive',
      includeInactiveValue,
    );

    return includeInactive ? undefined : true;
  }
}
