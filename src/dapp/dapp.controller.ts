import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

@Controller('dapp')
export class DappController {
  @Get()
  getDapp() {
    return 'First dApp';
  }

  @Get(':id')
  getParam(@Param('id') id: string): string {
    return `Get params ${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  createMessage(@Body('message') message: string) {
    return `The message:_ ${message}`;
  }
}
