import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Student } from 'src/student/entities/student.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Student, Lesson]),
    JwtModule.register({}),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtGuard],
})
export class AttendanceModule {}
