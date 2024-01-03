import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserDto } from '../dto';
import { User } from '../entities/user.entity';
import { GenericMapper } from '../../../shared/helpers';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @Inject(GenericMapper)
    private mapper: GenericMapper,
  ) {}

  async get(id: number): Promise<GetUserDto> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Find the user with the id and status active.
    const user: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    // Validate if the user exists.
    !user && new NotFoundException();
    // Map the user to the GetUserDto and return it.
    return this.mapper.map<User, GetUserDto>(user, GetUserDto);
  }

  async create(user: CreateUserDto): Promise<GetUserDto> {
    // Map the user to the User entity.
    const userCreated: User = await this._userRepository.save(
      this.mapper.map<CreateUserDto, User>(user, User),
    );
    // Map the user to the GetUserDto and return it.
    return this.mapper.map<User, GetUserDto>(userCreated, GetUserDto);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    // Validate if the user exists.
    !userExists && new NotFoundException();
    // Update the user and return it.
    return await this._userRepository.save({
      ...userExists,
      ...user,
    });
  }

  async delete(id: number): Promise<void> {
    // Validate if the id is empty.
    !id && new BadRequestException('id must be sent');
    // Validate if the user exists.
    const userExists: User = await this._userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    // Validate if the user exists.
    !userExists && new NotFoundException();
    // Delete the user.
    await this._userRepository.update(id, { status: 'INACTIVE' });
  }
}
