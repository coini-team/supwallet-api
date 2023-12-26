import { Injectable, NotFoundException } from '@nestjs/common';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import { ReceivingWallet } from 'src/modules/wallet/entities/receiving-wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        @InjectRepository(ReceivingWallet)
        private readonly receivingWalletRepository: Repository<ReceivingWallet>,
    ) { }

    // Función asincrónica para enviar tokens ERC-20
    async sendERC20tokens(chain: string, token: string, amount: string, sender: string) {
        try {

            // Verifica si el parámetro 'chain' está presente
            if (!chain) {
                throw new NotFoundException('Falta el parametro chain, que es un string.');
            }

            //Verifica si el parámetro 'receiver' está presente
            if (!sender) {
                throw new NotFoundException('Falta el parametro to, que es un string.');
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
                throw new NotFoundException('El valor de de envio no es válido.');
            }

            // Configuraciones específicas de la red según el parámetro 'chain'
            let network;
            switch (chain) {
                case 'polygon':
                    network = 'https://polygon-rpc.com/';
                    break;
                case 'mainnet':
                    network = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
                    break;
                case 'polygon-test':
                    network = 'https://rpc.ankr.com/polygon_mumbai';
                    break;
                // agregar otras redes para otros casos de uso 

                default:
                    throw new NotFoundException('Invalid chain parameter.');
            }

            // Fetch private key for the specified sender
            const senderWallet = await this.walletRepository.findOne({ address: sender });
            if (!senderWallet) {
                throw new NotFoundException('Sender wallet not found.');
            }
            // Configura el proveedor y la billetera utilizando ethers.js
            //const provider = new ethers.JsonRpcProvider(network);
            //const wallet = new ethers.Wallet(
            //this.configService.get(Blockchain.WALLET_PRIVATE_KEY),
            //provider
            //);

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

            const receiverWallet = await this.receivingWalletRepository.findOne();
            if (!receiverWallet) {
                throw new NotFoundException('Receiver wallet not found.');
            }

            const receiverAddress = receiverWallet.address;

            // Realiza la transferencia de tokens
            const transaction = await erc20Contract.transfer(receiverAddress, decimalAmount);
            console.log("Transaction hash:", transaction.hash);
            await transaction.wait();
            console.log("Transaction confirmed");
            console.log(chain);

            // Retorna un mensaje indicando el monto y el éxito de la transacción
            return 'monto: ' + decimalAmount + '. Transaccíon realizada con exito'
        } catch (error) {
            // Personaliza el manejo de errores según la necesidad
            console.error('Error sending tokens:', error.message);
            console.error(Number(amount))
            throw new NotFoundException('Error al enviar tokens: ' + error.message);
        }
    }
}
