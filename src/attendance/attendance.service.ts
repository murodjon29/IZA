import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Student } from 'src/student/entities/student.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: createAttendanceDto.studentId },
      });
      const lesson = await this.lessonRepository.findOne({
        where: { id: createAttendanceDto.lessonId },
      });

      if (!student || !lesson) {
        throw new NotFoundException('Student or Lesson not found');
      }

      const attendance = this.attendanceRepository.create({
        student,
        lesson,
        status: createAttendanceDto.status,
      });

      const saved = await this.attendanceRepository.save(attendance);
      return {
        status_code: 201,
        message: 'Attendance created successfully',
        data: saved,
      };
    } catch (error) {
      return {
        status_code: 400,
        message: error.message,
      };
    }
  }

  async findAll() {
    try {
      const attendances = await this.attendanceRepository.find({
        relations: ['student', 'lesson'],
      });
      return {
        status_code: 200,
        message: 'Attendances found successfully',
        data: attendances,
      };
    } catch (error) {
      return {
        status_code: 400,
        message: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
        relations: ['student', 'lesson'],
      });
      if (!attendance) {
        throw new NotFoundException('Attendance not found');
      }
      return {
        status_code: 200,
        message: 'Attendance found successfully',
        data: attendance,
      };
    } catch (error) {
      return {
        status_code: error.status || 400,
        message: error.message,
      };
    }
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });
      if (!attendance) {
        throw new NotFoundException('Attendance not found');
      }

      Object.assign(attendance, updateAttendanceDto);
      const updated = await this.attendanceRepository.save(attendance);

      return {
        status_code: 200,
        message: 'Attendance updated successfully',
        data: updated,
      };
    } catch (error) {
      return {
        status_code: error.status || 400,
        message: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });
      if (!attendance) {
        throw new NotFoundException('Attendance not found');
      }

      await this.attendanceRepository.delete(id);
      return {
        status_code: 200,
        message: 'Attendance deleted successfully',
      };
    } catch (error) {
      return {
        status_code: error.status || 400,
        message: error.message,
      };
    }
  }
}
