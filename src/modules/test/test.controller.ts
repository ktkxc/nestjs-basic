import {
  Controller,
  Param,
  Get,
  Query,
  Request,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestService } from './test.service';
import { ZgsyNest } from './entities/test.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from '../../common/guards/user.guard';

@ApiBearerAuth()
@Controller('test')
@ApiTags('TestController描述')
@UseGuards(AuthGuard(), UserGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get(':id')
  async index(@Param('id') id) {
    const data = await this.testService.findid(id);
    return data;
  }
  @Post()
  async create(@Body() body: ZgsyNest) {
    const data = await this.testService.createMany(body);
    return data;
  }
  @Get()
  async findAll(@Query() query, @Request() req) {
    console.log('testService...findAll');
    const data = await this.testService.findAll();
    return data;
  }
}
