import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUserDto } from '../dto';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtect } from '../../role/decorators/role.decorator';
import { RoleTypeEnum } from '../../../shared/enums/role-type.enum';
import { RoleGuard } from '../../role/guards/role.guard';

@Controller('user')
export class UserController {
  private readonly _logger = new Logger(':::: UserController ::::');
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    this._logger.log(JSON.stringify(createUserDto));
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @RoleProtect(RoleTypeEnum.ADMIN, RoleTypeEnum.MEMBER)
  @UseGuards(AuthGuard(), RoleGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    return await this.userService.get(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
