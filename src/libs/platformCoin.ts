import { Network, Blockchain } from '@haechi-labs/face-types';
import { BigNumber, utils } from 'ethers';
import { isEthlikeBlockchain, networkToBlockchain } from './utils';

export const getPlatFormCoinDecimalByBlockchain = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case Blockchain.ETHEREUM:
    case Blockchain.POLYGON:
    case Blockchain.KLAYTN:
    case Blockchain.BNB_SMART_CHAIN:
      // case Blockchain.BORA:
      return 18;
    case Blockchain.SOLANA:
      return 9;
    case Blockchain.NEAR:
      return 24;
    default:
      throw new Error('unsupported blockchain');
  }
};

export function formatPlatformCoin(balance: BigNumber, network: Network) {
  const blockchain = networkToBlockchain(network);
  if (isEthlikeBlockchain(blockchain)) {
    return utils.formatEther(balance);
  } else {
    return utils.formatUnits(balance, getPlatFormCoinDecimalByBlockchain(blockchain));
  }
}
