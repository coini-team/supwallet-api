// Third Party Dependencies.
import { Inject, Injectable } from '@nestjs/common';
import { MessageBird } from 'messagebird/types';
import { promisify } from 'util';

// Local Dependencies.
import { ConfigService } from 'src/config/config.service';
import { Message } from '../../../config/config.keys';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MessageBirdClient')
    private readonly messageBird: MessageBird,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @memberof MessageService
   * @description This method is used to send verification code to recipient.
   * @param {string} recipient
   * @returns {Promise<MessageBird.VerifyResponse>}
   */
  async sendVerificationCode(recipient: string): Promise<any> {
    // Create Message Instance and Generate Verification Code.
    const createPromise = promisify(this.messageBird.verify.create).bind(
      this.messageBird.verify,
    );
    // Send Message.
    const response = await createPromise(recipient, {
      originator: '38383',
      timeout: parseInt(this.configService.get(Message.MESSAGEBIRD_TIMEOUT)),
    });

    return response;
  }

  /**
   * @memberof MessageService
   * @description This method is used to verify message code.
   * @param {string} recipient
   * @param {string} token
   * @returns {Promise<MessageBird.VerifyResponse>}
   */
  async verifyCode(recipient: string, token: string): Promise<any> {
    // Create Verify Instance.
    const verifyPromise = promisify(this.messageBird.verify.verify).bind(
      this.messageBird.verify,
    );
    // Verify Code and Return Response.
    return await verifyPromise(token, {
      originator: '38383',
      timeout: parseInt(this.configService.get(Message.MESSAGEBIRD_TIMEOUT)),
    });
  }
}
