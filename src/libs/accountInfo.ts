import { Face } from '@haechi-labs/face-react-native-sdk';
import {
  Blockchain,
  FaceLoginResponse,
  isEthlikeBlockchain,
  Network,
  networkToBlockchain,
} from '@haechi-labs/face-types';
import * as solanaWeb3 from '@solana/web3.js';
import { BigNumber, providers } from 'ethers';
import * as nearAPI from 'near-api-js';

import { config as nearConfig } from '../config/near';
import { getProvider } from './utils';

interface AccountInfo {
  address: string;
  balance: BigNumber;
  user: FaceLoginResponse;
}

export async function getAccountInfo(face: Face, network: Network): Promise<AccountInfo> {
  const blockchain = networkToBlockchain(network);
  const user = await face?.auth.getCurrentUser();

  if (blockchain === Blockchain.SOLANA) {
    return getSolanaAccountInfo(face, network, user!);
  } else if (blockchain === Blockchain.NEAR) {
    return getNearAccountInfo(face, network, user!);
  } else if (isEthlikeBlockchain(blockchain)) {
    return getEthereumLikeAccountInfo(face, network, user!);
  }

  throw new Error('unknown blockchain ' + blockchain);
}

async function getSolanaAccountInfo(face: Face, network: Network, user: FaceLoginResponse) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const solanaProvider = face.solana.getProvider();
  const publicKeys = await solanaProvider.getPublicKeys();

  const solanaNodeUrl = getProvider(network);
  const connection = new solanaWeb3.Connection(solanaNodeUrl, 'confirmed');
  const balance = await connection.getBalance(publicKeys[0]);

  return {
    address: publicKeys[0].toBase58(),
    balance: BigNumber.from(balance),
    user,
  };
}

async function getNearAccountInfo(face: Face, network: Network, user: FaceLoginResponse) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nearProvider = face.near.getProvider();
  const publicKeys = await nearProvider.getPublicKeys();

  const address = Buffer.from(publicKeys[0].data).toString('hex');
  const near = await nearAPI.connect(nearConfig(network));
  const account = await near.account(address);

  return {
    address,
    balance: await account
      .getAccountBalance()
      .then((bal) => {
        return BigNumber.from(bal.total);
      })
      .catch(() => {
        return BigNumber.from('0');
      }),
    user,
  };
}

async function getEthereumLikeAccountInfo(face: Face, network: Network, user: FaceLoginResponse) {
  const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const balance = await signer.getBalance();

  return {
    address,
    balance,
    user,
  };
}
