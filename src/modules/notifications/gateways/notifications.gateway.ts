import { NotificationsService } from '../services/notifications.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway implements OnModuleInit {
  // NotificationsGateway Logger.
  private logger: Logger = new Logger('NotificationsGateway');
  // Websocket Server.
  @WebSocketServer()
  public server: Server;
  /**
   * @description Constructor Dependency Injection.
   * @param notificationsService NotificationsService Instance.
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * @memberof NotificationsGateway
   * @description On Module Init Lifecycle Hook.
   * @returns {void}
   */
  onModuleInit(): void {
    // Listen for Contract Events.
    this.logger.log(':::Listening for contract events:::');
    this.notificationsService.smartContractEvent();
  }
}
