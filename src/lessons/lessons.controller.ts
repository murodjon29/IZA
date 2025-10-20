import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Roles } from 'src/helpers/decorators/roles.decorator';
import { ROLE } from 'src/helpers/enum';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helpers/guard/roles.guard';

@Controller('lessons')
@UseGuards(JwtGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles(ROLE.TEACHER)
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(ROLE.TEACHER)
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(+id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(ROLE.TEACHER)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }
}
