import { Controller } from '@nestjs/common';
import { ChainService } from '../services/chain.service';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}
}
