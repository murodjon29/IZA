import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from 'src/helpers/decorators/roles.decorator';
import { ROLE } from 'src/helpers/enum';
import { RolesGuard } from 'src/helpers/guard/roles.guard';
import { JwtGuard } from 'src/helpers/guard/jwt-auth.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN, ROLE.TEACHER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
