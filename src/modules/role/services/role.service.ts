import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { GenericMapper } from '../../../shared/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, GetRoleDto, UpdateRoleDto } from '../../role/dto';
import { Role } from '../entities/role.entity';

export class RoleService {
  private readonly _logger = new Logger(':::: RoleService ::::');
  private readonly mapper = new GenericMapper();
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async get(id: number): Promise<GetRoleDto> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Find the role with the id and status active.
    const role: Role = await this._roleRepository.findOne(id);
    // Validate if the role exists.
    !role && new NotFoundException();
    // Map the role to the GetRoleDto and return it.
    return this.mapper.map<Role, GetRoleDto>(role, GetRoleDto);
  }
  x;
  async create(role: CreateRoleDto): Promise<GetRoleDto> {
    // Map the role to the Role entity.
    const roleEntity: Role = this.mapper.map<CreateRoleDto, Role>(role, Role);
    // Save the role and return it.
    const roleCreated: Role = await this._roleRepository.save(roleEntity);
    // Map the role to the GetRoleDto and return it.
    return this.mapper.map<Role, GetRoleDto>(roleCreated, GetRoleDto);
  }

  async update(id: number, role: UpdateRoleDto): Promise<Role> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the role exists.
    const roleExists: Role = await this._roleRepository.findOne(id);
    // Validate if the role exists.
    !roleExists && new NotFoundException();
    // Update the role and return it.
    return await this._roleRepository.save({
      ...roleExists,
      ...role,
    });
  }

  async delete(id: number): Promise<void> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the role exists.
    const roleExists: Role = await this._roleRepository.findOne(id);
    // Validate if the role exists.
    !roleExists && new NotFoundException();
    // Delete the role.
    await this._roleRepository.delete(id);
  }
}
