import { Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { ReceiverWallet } from 'src/modules/wallet/entities/receiver-wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Network } from 'src/modules/chain/entities/network.entity';
import { SendPaymentDto } from '../dto/send-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        @InjectRepository(ReceiverWallet)
        private readonly receiverWalletRepository: Repository<ReceiverWallet>,
        @InjectRepository(Network)
        private readonly NetworkRepository: Repository<Network>,
    ) { }

    // Función asincrónica para enviar tokens ERC-20
    async sendERC20tokens(chain: string, sendPayment: SendPaymentDto) {
        try {
            const { sender, token, amount } = sendPayment;
            // Verifica si el parámetro 'chain' está presente
            if (!chain) {
                throw new NotFoundException('Falta el parametro chain, que es un string.');
            }

            //Verifica si el parámetro 'receiver' está presente
            if (!sender) {
                throw new NotFoundException('Falta el parametro sender, que es un string.');
            }

            // Verifica si el parámetro 'token' está presente
            if (!token) {
                throw new NotFoundException('Falta el parametro token, que es un string.');
            }

            // Verifica si el parámetro 'amount' está presente
            if (!amount) {
                throw new NotFoundException('Falta el parametro amount, que es un string.');

            }

            // Convierte el monto a un valor numérico
            const numericAmount = parseFloat(amount);

            // Verifica si el monto es inválido
            if (isNaN(numericAmount) || numericAmount < 0.0000001 || amount.length > 8) {
                throw new NotFoundException("El valor de de envio no es válido.");
            }

            // traer network url
            const urlNetwork = await this.NetworkRepository.findOne({ name: chain });
            if (!urlNetwork) {
                throw new NotFoundException('Chain no encontrado en la base de datos');
            }

            const network = urlNetwork.rpc_url;

            // Traer la llave privada de la wallet sender 
            const senderWallet = await this.walletRepository.findOne({ address: sender });
            if (!senderWallet) {
                throw new NotFoundException('Sender no encontrado en la base de datos');
            }

            const senderPrivateKey = senderWallet.privateKey;

            // Configures the provider and wallet using ethers.js
            const provider = new ethers.JsonRpcProvider(network);
            const wallet = new ethers.Wallet(senderPrivateKey, provider);

            // Crea una instancia del contrato para el token ERC-20
            const erc20Contract = new ethers.Contract(
                token,
                ["function transfer(address to, uint256 amount)"],
                wallet
            );

            // Convierte el monto a unidades decimales
            const decimalAmount = ethers.parseUnits(amount, 6);

            const receiverWallet = await this.receiverWalletRepository.findOne();
            if (!receiverWallet) {
                throw new NotFoundException('Receiver wallet no encontrada en la base de datos.');
            }

            const receiverAddress = receiverWallet.address;

            // Realiza la transferencia de tokens
            const transaction = await erc20Contract.transfer(receiverAddress, decimalAmount);
            console.log("Transaction hash:", transaction.hash);
            await transaction.wait();
            console.log("Transaction confirmed");

            // Retorna un mensaje indicando el monto y el éxito de la transacción
            return 'monto: ' + decimalAmount + '. Transaccíon realizada con exito'
        } catch (error) {
            // Personaliza el manejo de errores según la necesidad
            console.error('Error sending tokens:', error);
            throw new NotFoundException('Error al enviar tokens: ' + error.message);
        }
    }
}
