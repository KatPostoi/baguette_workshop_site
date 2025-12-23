import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/types';
import { Public } from '../auth/public.decorator';
import { CustomFramesService } from './custom-frames.service';
import { CreateCustomFrameDto } from './dto/create-custom-frame.dto';
import { PriceQuoteDto } from './dto/price-quote.dto';
import { CustomFrameResponse } from './dto/custom-frame.response';

@Controller('custom-frames')
export class CustomFramesController {
  constructor(private readonly service: CustomFramesService) {}

  @Public()
  @Post('quote')
  quote(@Body() dto: PriceQuoteDto): Promise<{ price: number }> {
    return this.service.quote(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCustomFrameDto,
  ): Promise<CustomFrameResponse> {
    return this.service.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: AuthUser): Promise<CustomFrameResponse[]> {
    return this.service.list(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<CustomFrameResponse> {
    return this.service.getById(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    return this.service.remove(id, user.sub);
  }
}
