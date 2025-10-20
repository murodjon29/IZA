import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Group } from 'src/group/entities/group.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const group = await this.groupRepository.findOneBy({ id: createStudentDto.groupId });
      if (!group) {
        return { status_code: 404, message: '❌ Group not found' };
      }

      const student = this.studentRepository.create({
        ...createStudentDto,
        group,
      });
      await this.studentRepository.save(student);

      return {
        status_code: 201,
        message: '✅ Student created successfully',
        data: student,
      };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }

  async findAll() {
    try {
      const students = await this.studentRepository.find({ relations: ['group'] });
      return {
        status_code: 200,
        message: '✅ Students retrieved successfully',
        data: students,
      };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id },
        relations: ['group'],
      });
      if (!student) {
        return { status_code: 404, message: '❌ Student not found' };
      }

      return {
        status_code: 200,
        message: '✅ Student retrieved successfully',
        data: student,
      };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        return { status_code: 404, message: '❌ Student not found' };
      }

      if (updateStudentDto.groupId) {
        const group = await this.groupRepository.findOneBy({ id: updateStudentDto.groupId });
        if (!group) {
          return { status_code: 404, message: '❌ Group not found' };
        }
        student.group = group;
      }

      Object.assign(student, updateStudentDto);
      await this.studentRepository.save(student);

      return { status_code: 200, message: '✅ Student updated successfully' };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        return { status_code: 404, message: '❌ Student not found' };
      }

      await this.studentRepository.delete(id);
      return {
        status_code: 200,
        message: '✅ Student deleted successfully',
      };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }
}
 