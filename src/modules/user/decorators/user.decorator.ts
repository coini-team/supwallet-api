import { createParamDecorator } from '@nestjs/common';
import { GetUserDto } from '../dto';

export const GetUser = createParamDecorator((data, req): GetUserDto => {
  return req.user;
});
