// Third Party Dependencies.
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Local Dependencies.
import { MessageService } from '../../modules/message/services/message.service';
import { ConfigService } from 'src/config/config.service';
import { JwtEnv } from '../../config/config.keys';
import { AuthRepository } from '../repositories/auth.repository';
import { SignInDto, SignUpDto } from '../dto';
import { compare } from 'bcryptjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RoleTypeEnum } from '../../shared/enums/role-type.enum';
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/shared/constants/auth.constant';

// QR, buffer, files
import * as QRCode from 'qrcode';
import { Buffer } from 'buffer';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  /**
   * @memberof AuthService
   * @description This method is used to create an instance of AuthService class.
   * @param messageBirdService
   * @param jwtService
   */
  constructor(
    private readonly messageBirdService: MessageService,
    private readonly configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _authRepository: AuthRepository,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) { }

  async signUp(user: SignUpDto) {
    const { email }: SignUpDto = user;
    const userExist: User = await this._userRepository.findOne({
      where: { email },
    });

    if (userExist) throw new ConflictException('User already exist');

    return this._authRepository.signUp(user);
  }

  async signIn(user: SignInDto): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: JwtPayload;
  }> {
    const { email, password } = user;

    const userExist = await this._userRepository.findOne({
      where: { email },
    });

    if (!userExist) throw new ConflictException('User does not exist');

    const isMatch = await compare(password, userExist.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      roles: userExist.roles.map((role) => role.name as RoleTypeEnum),
    };

    const tokens = this.generateTokens(payload);
    console.log('=> verify:', this.validToken(tokens.accessToken));
    return {
      user: payload,
      tokens,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to send verification message to recipient.
   * @param {string} recipient
   * @returns {Promise<{ id: string; message: string }>}
   */
  async sendVerifyMessage(
    recipient: string,
  ): Promise<{ id: string; message: string }> {
    // Send message to recipient.
    const response =
      await this.messageBirdService.sendVerificationCode(recipient);
    // Return Response.
    return {
      message: 'Verification Send',
      id: response.id,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to verify message code.
   * @param {{ recipient: string; token: string }} {
   *    recipient,
   *    token,
   *    }
   * @returns {Promise<{ id: string; message: string }>}
   */
  async verifyMessageCode({
    recipient,
    token,
  }): Promise<{ id: string; message: string }> {
    // Verify Code.
    const response = await this.messageBirdService.verifyCode(recipient, token);
    // Return Response.
    return {
      message: 'Verification Send',
      id: response.id,
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to generate tokens, Access Token and Refresh Token.
   * @param {JwtPayload} payload
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  public generateTokens(payload): {
    accessToken: string;
    refreshToken: string;
  } {
    // Generate tokens and return.
    return {
      accessToken: this._jwtService.sign(payload, {
        secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
        expiresIn: this.configService.get(JwtEnv.JWT_REFRESH_EXPIRES_IN),
      }),
      refreshToken: this._jwtService.sign(payload, {
        secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
        expiresIn: this.configService.get(JwtEnv.JWT_REFRESH_EXPIRES_IN),
      }),
    };
  }

  /**
   * @memberof AuthService
   * @description This method is used to refresh tokens with refresh token.
   * @param {string} refresh
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  async refreshToken(
    refresh: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate refresh token and get payload.
    const validate = await this._jwtService.verify(refresh, {
      secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
    });
    // If refresh token is invalid, throw an error.
    if (!validate) throw new Error('refresh token expires');
    // Destructure payload.
    const { id, name } = validate;
    // Generate new tokens and return.
    return this.generateTokens({
      id,
      name,
    });
  }

  public validToken(accessToken: string) {
    this._jwtService.verify(accessToken, {
      // secret: 'test',
      secret: this.configService.get(JwtEnv.JWT_REFRESH_SECRET),
    });
  }

  /**
   * 
   * @param phone 
   */
  async validateUser(phone: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone },
    });
    if (userExist) {
      const payload = {
        id: userExist.id,
        phone: userExist.phone,
      };
      const { accessToken } = this.generateTokens(payload);
      await this._userRepository.update(userExist.id, {
        accessToken
      });
    }
    if (userExist) {
      return { success: true };
    }
    return { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND };
  }

  /**
   * 
   * @param phone 
   * @param password 
   * @returns 
   */
  async createAccount(phone: string, password: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone },
    });
    if (userExist) throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXIST);
    const wallet = '0x82a6505bc726018aC603fa072aAE2a0474cdE45b';
    const account: User = await this._userRepository.create({
      name: '',
      email: '',
      password,
      phone,
      wallet,
      qrCode: `http://localhost:4002/${wallet}.png`,
    });
    const user = await this._userRepository.save(account);
    const payload = {
      id: user.id,
      phone: user.phone,
    };
    const { accessToken } = this.generateTokens(payload);
    await this._userRepository.update(user.id, {
      accessToken
    });
    await this.generateQR(wallet);
    return {
      success: true,
      wallet,
    };
  }

  /**
   * 
   * @param phone 
   * @param password 
   * @returns 
   */
  async startSession(phone: string, password: string) {
    const userExist: User = await this._userRepository.findOne({
      where: { phone, password },
    });
    if (userExist) {
      const payload = {
        id: userExist.id,
        phone: userExist.phone,
      };
      const { accessToken } = this.generateTokens(payload);
      await this._userRepository.update(userExist.id, {
        accessToken
      });
      return { success: true, accessToken };
    }
    return { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND };
  }

  async generateQR(text) {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
        const buffer = Buffer.from(qrCodeDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
        // Specify the path and name of the file
        const filePath = `public/${text}.png`;
        // Write the buffer to a JPG file
        fs.writeFile(filePath, buffer, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code', error);
        throw error;
    }
}
}
