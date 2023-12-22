import { Controller, Post, Body } from '@nestjs/common';
import { SampleService } from '../../services/sample/sample.service';

@Controller('sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post('encrypt')
  encrypt(@Body('message') message: string) {
    return this.sampleService.encrypt(message);
  }

  @Post('decrypt')
  decrypt(@Body('message') message: string) {
    return this.sampleService.decrypt(message);
  }
}
