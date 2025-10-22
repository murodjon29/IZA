import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Roles } from 'src/helpers/decorators/roles.decorator';
import { ROLE } from 'src/helpers/enum';
import { RolesGuard } from 'src/helpers/guard/roles.guard';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.TEACHER)
  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.TEACHER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
