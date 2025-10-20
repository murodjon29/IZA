import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Group } from 'src/group/entities/group.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const { groupId, teacherId, date, startTime, endTime, topic } = createLessonDto;
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException(`Group #${groupId} not found`);
    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });
    if (!teacher) throw new NotFoundException(`Teacher #${teacherId} not found`);
    const lesson = this.lessonRepository.create({
      group,
      teacher,
      date,
      startTime,
      endTime,
      topic,
    });
    return await this.lessonRepository.save(lesson);
  }

  async findAll() {
    return await this.lessonRepository.find({
      relations: ['group', 'teacher'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['group', 'teacher'],
    });
    if (!lesson) throw new NotFoundException(`Lesson #${id} not found`);
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException(`Lesson #${id} not found`);
    if (updateLessonDto.groupId) {
      const group = await this.groupRepository.findOne({
        where: { id: updateLessonDto.groupId },
      });
      if (!group) throw new NotFoundException(`Group #${updateLessonDto.groupId} not found`);
      lesson.group = group;
    }
    if (updateLessonDto.teacherId) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: updateLessonDto.teacherId },
      });
      if (!teacher) throw new NotFoundException(`Teacher #${updateLessonDto.teacherId} not found`);
      lesson.teacher = teacher;
    }
    Object.assign(lesson, updateLessonDto);
    return await this.lessonRepository.save(lesson);
  }

  async remove(id: number) {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException(`Lesson #${id} not found`);
    await this.lessonRepository.remove(lesson);
    return { message: `Lesson #${id} deleted successfully` };
  }
}
