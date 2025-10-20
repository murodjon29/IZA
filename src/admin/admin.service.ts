import { Injectable, OnModuleInit, UnauthorizedException, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ROLE } from 'src/helpers/enum';
import * as bcrypt from 'bcrypt';
import config from 'src/config';
import { Response as Res } from 'express';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const superAdmin = await this.adminRepository.findOne({
      where: { role: ROLE.SUPERADMIN },
    });

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(config.SP_ADMIN_PASSWORD, 10);
      const admin = this.adminRepository.create({
        login: config.SP_ADMIN_LOGIN,
        password: hashedPassword,
        role: ROLE.SUPERADMIN,
      });
      await this.adminRepository.save(admin);
      console.log('✅ Super admin created');
    } else {
      console.log('ℹ️ Super admin already exists');
    }
  }

  // 🔐 LOGIN
  async login(login: string, password: string, res: Res) {
    const admin = await this.adminRepository.findOne({ where: { login } });
    if (!admin) throw new UnauthorizedException('Admin topilmadi');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Parol noto‘g‘ri');

    const accessToken = this.jwtService.sign(
      { id: admin.id, role: admin.role },
      { secret: config.ACCESTOKEN_KEY, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { id: admin.id },
      { secret: config.ACCESTOKEN_KEY, expiresIn: '30d' },
    );

    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
    });

    return {
      status_code: 200,
      message: '✅ Login muvaffaqiyatli',
      access_token: accessToken,
    };
  }

  // ♻️ REFRESH TOKEN
  async refreshToken(res: Res, refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: config.RERESHTOKEN_KEY,
      });

      const admin = await this.adminRepository.findOne({
        where: { id: payload.id },
      });
      if (!admin) throw new UnauthorizedException('Admin topilmadi');

      const newAccessToken = this.jwtService.sign(
        { id: admin.id, role: admin.role },
        { secret: config.ACCESTOKEN_KEY, expiresIn: '15m' },
      );

      return {
        status_code: 200,
        message: '✅ Yangi token yaratildi',
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token noto‘g‘ri yoki eskirgan');
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });
    await this.adminRepository.save(admin);
    return { status_code: 201, message: '✅ Admin created successfully', data: admin };
  }

  async findAll() {
    const admins = await this.adminRepository.find();
    return { status_code: 200, data: admins };
  }

  async findOne(id: number) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    return admin ? { data: admin } : { message: 'Admin not found' };
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return { message: 'Admin not found' };

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    await this.adminRepository.update(id, dto);
    return { message: '✅ Admin updated' };
  }

  async remove(id: number) {
    await this.adminRepository.delete(id);
    return { message: '✅ Admin deleted' };
  }
}
