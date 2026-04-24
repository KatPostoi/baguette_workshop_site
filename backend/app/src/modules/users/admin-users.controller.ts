import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types';
import { AdminUserFilterDto } from './dto/admin-user-filter.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { parseOptionalBooleanQuery } from '../../common/query/parse-optional-boolean-query';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(
    @Query() filters: AdminUserFilterDto,
    @Query('isActive') isActiveRaw?: string,
  ) {
    return this.usersService.searchAdminUsers({
      ...filters,
      isActive: parseOptionalBooleanQuery('isActive', isActiveRaw),
    });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AdminUpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.updateAdminUser(id, dto, user.sub);
  }

  @Delete(':id')
  deactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.deactivateAdminUser(id, user.sub);
  }
}
