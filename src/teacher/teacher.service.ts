import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import config from 'src/config';
import { ROLE } from 'src/helpers/enum';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createTeacherDto: CreateTeacherDto, res: Response) {
    try {
      const existing = await this.teacherRepository.findOne({
        where: { login: createTeacherDto.login },
      });
      if (existing) {
        return { status_code: 400, message: '❌ Login allaqachon band' };
      }

      const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);
      const teacher = this.teacherRepository.create({
        role: ROLE.TEACHER,
        ...createTeacherDto,
        password: hashedPassword,
      });
      await this.teacherRepository.save(teacher);

      const tokens = await this.generateTokens(teacher.id, teacher.login, teacher.role);

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        status_code: 201,
        message: '✅ Teacher created successfully',
        data: { teacher, access_token: tokens.access_token },
      };
    } catch (error) {
      return { status_code: 500, message: error.message };
    }
  }

  async login(login: string, password: string, res: Response) {
    const teacher = await this.teacherRepository.findOne({ where: { login } });
    if (!teacher) throw new UnauthorizedException('❌ Login yoki parol noto‘g‘ri');

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) throw new UnauthorizedException('❌ Login yoki parol noto‘g‘ri');

    const tokens = await this.generateTokens(teacher.id, teacher.login, teacher.role);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      status_code: 200,
      message: '✅ Muvaffaqiyatli login qilindi',
      data: { access_token: tokens.access_token, teacher },
    };
  }

  async refreshToken(res: Response, oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: config.RERESHTOKEN_KEY,
      });

      const teacher = await this.teacherRepository.findOne({
        where: { id: payload.id },
      });
      if (!teacher) throw new UnauthorizedException('Teacher topilmadi');

      const tokens = await this.generateTokens(teacher.id, teacher.login, teacher.role);

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        status_code: 200,
        message: '✅ Token yangilandi',
        data: { access_token: tokens.access_token },
      };
    } catch {
      throw new UnauthorizedException('❌ Refresh token noto‘g‘ri yoki eskirgan');
    }
  }

  private async generateTokens(id: number, login: string, role: string) {
    const access_token = await this.jwtService.signAsync(
      { id, login, role },
      { secret: config.ACCESTOKEN_KEY, expiresIn: '15m' },
    );
    const refresh_token = await this.jwtService.signAsync(
      { id },
      { secret: config.RERESHTOKEN_KEY, expiresIn: '7d' },
    );

    return { access_token, refresh_token };
  }

  async findAll() {
    const teachers = await this.teacherRepository.find({relations: ['lessons', 'groups']});
    return { status_code: 200, data: teachers };
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({ where: { id }, relations: ['lessons', 'groups'] });
    if (!teacher)
      return { status_code: 404, message: '❌ Teacher topilmadi' };
    return { status_code: 200, data: teacher };
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher)
      return { status_code: 404, message: '❌ Teacher topilmadi' };

    if (dto.password)
      dto.password = await bcrypt.hash(dto.password, 10);

    await this.teacherRepository.update(id, dto);
    return { status_code: 200, message: '✅ Teacher yangilandi' };
  }

  async remove(id: number) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher)
      return { status_code: 404, message: '❌ Teacher topilmadi' };

    await this.teacherRepository.delete(id);
    return { status_code: 200, message: '✅ Teacher o‘chirildi' };
  }
}
