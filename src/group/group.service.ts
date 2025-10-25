import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const teacher = await this.teacherRepository.findOneBy({ id: createGroupDto.teacherId });
    if (!teacher) return { status_code: 404, message: '❌ Teacher not found' };
    const group = this.groupRepository.create({ ...createGroupDto, teacher });
    await this.groupRepository.save(group);
    return { status_code: 201, message: '✅ Group created successfully', data: group };
  }

  async findAll() {
    const groups = await this.groupRepository.find({ relations: ['teacher', 'students'] });
    return { status_code: 200, message: '✅ Groups retrieved successfully', data: groups };
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({ where: { id }, relations: ['teacher', 'students'] });
    if (!group) return { status_code: 404, message: '❌ Group not found' };
    return { status_code: 200, message: '✅ Group retrieved successfully', data: group };
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({ where: { id }, relations: ['teacher', 'students'] });
    if (!group) return { status_code: 404, message: '❌ Group not found' };
    if (updateGroupDto.teacherId) {
      const teacher = await this.teacherRepository.findOneBy({ id: updateGroupDto.teacherId });
      if (!teacher) return { status_code: 404, message: '❌ Teacher not found' };
      group.teacher = teacher;
    }
    Object.assign(group, updateGroupDto);
    await this.groupRepository.save(group);
    return { status_code: 200, message: '✅ Group updated successfully' };
  }

  async remove(id: number) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) return { status_code: 404, message: '❌ Group not found' };
    await this.groupRepository.delete(id);
    return { status_code: 200, message: '✅ Group deleted successfully' };
  }
}
