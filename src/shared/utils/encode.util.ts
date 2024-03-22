import { ethers } from 'ethers';
import erc20TokenABI from 'src/contracts/abis/ERC20_ABI.json';

export function encodeABI() {
    const iface = new ethers.Interface(erc20TokenABI);
    const arg1 = '0x407a51f7566bf81D6553CA9DE5F920aa64aE1942';
    const arg2 = '1000000';
    const encodeABI = iface.encodeFunctionData('transfer', [arg1, arg2]);
    console.log('=> encodeABI:', encodeABI);
    return encodeABI;
}