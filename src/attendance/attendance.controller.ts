import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helpers/guard/roles.guard';
import { Roles } from 'src/helpers/decorators/roles.decorator';
import { ROLE } from 'src/helpers/enum';

@Controller('attendance')
@UseGuards(JwtGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(ROLE.ADMIN, ROLE.TEACHER)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles(ROLE.ADMIN, ROLE.TEACHER)
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @Roles(ROLE.ADMIN, ROLE.TEACHER)
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(+id);
  }

  @Patch(':id')
  @Roles(ROLE.ADMIN, ROLE.TEACHER)
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles(ROLE.ADMIN, ROLE.TEACHER)
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
