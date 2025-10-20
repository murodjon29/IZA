import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from 'src/helpers/decorators/roles.decorator';
import { ROLE } from 'src/helpers/enum';
import { Response, Request } from 'express';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helpers/guard/roles.guard';
import { SelfGuard } from 'src/helpers/guard/self.guard';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('register')
  async register(
    @Body() createTeacherDto: CreateTeacherDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.teacherService.register(createTeacherDto, res);
  }

  @Post('login')
  async login(
    @Body('login') login: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.teacherService.login(login, password, res);
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    return this.teacherService.refreshToken(res, refreshToken);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Get()
  async findAll() {
    return this.teacherService.findAll();
  }

  @UseGuards(JwtGuard, SelfGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @UseGuards(JwtGuard, SelfGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
