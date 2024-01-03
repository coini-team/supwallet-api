// Third Party Dependencies.
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Local Dependencies.
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [],
})
export class RoleModule {}
