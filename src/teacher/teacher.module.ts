import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher } from './entities/teacher.entity';
import config from 'src/config';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';
import { RolesGuard } from 'src/helpers/guard/roles.guard';
import { SelfGuard } from 'src/helpers/guard/self.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher]),
    JwtModule.register({
      secret: config.ACCESTOKEN_KEY,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, JwtGuard, RolesGuard, SelfGuard],
  exports: [TeacherService],
})
export class TeacherModule {}
