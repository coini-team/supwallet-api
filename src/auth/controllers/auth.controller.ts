// Third Party Dependencies.
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// Local Dependencies.
import { GetUser } from '../../modules/user/decorators/user.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../services/auth.service';
import { SignInDto, SignUpDto, ValidateDto, AccountDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) { }

  @Post('validate')
  async validatePhoneNumber(@Body() payload: ValidateDto) {
    const { phone } = payload;
    const userExists = await this._authService.validateUser(phone);
    if (userExists) {
      return { result: true, message: 'El usuario existe' };
    }
    return { result: false, message: 'El usuario no existe' };
  }

  @Post('account')
  async createWallet(@Body() payload: AccountDto) {
    const { phone, password } = payload;
    const wallet = await this._authService.createAccount(phone, password);
    return { wallet };
  }

  @Post('session')
  async startSession(@Body() payload: AccountDto) {
    const { phone, password } = payload;
    return await this._authService.startSession(phone, password);
  }

  /**
   * @memberof AuthController
   * @description This method is used to sign up a user.
   * @param signUpDto
   * @returns {Promise<void>}
   */
  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this._authService.signUp(signUpDto);
  }

  /**
   * @memberof AuthController
   * @description This method is used to sign in a user.
   * @param signInDto
   * @returns {Promise<{
   *   tokens: { accessToken: string; refreshToken: string };
   *   user: JwtPayload;
   *   }>}
   */
  @Post('signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignInDto): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: JwtPayload;
  }> {
    return this._authService.signIn(signInDto);
  }
}
