import { isEthlikeBlockchain, Network, Blockchain } from '@haechi-labs/face-types';
import { BigNumber, utils } from 'ethers';

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
    // case Blockchain.NEAR:
    //   return 24;
    default:
      throw new Error('unsupported blockchain');
  }
};

export function networkToBlockchain(network: Network): Blockchain {
  switch (network) {
    case Network.ETHEREUM:
    case Network.ROPSTEN:
    case Network.GOERLI:
      return Blockchain.ETHEREUM;
    case Network.POLYGON:
    case Network.MUMBAI:
      return Blockchain.POLYGON;
    case Network.BNB_SMART_CHAIN:
    case Network.BNB_SMART_CHAIN_TESTNET:
      return Blockchain.BNB_SMART_CHAIN;
    case Network.KLAYTN:
    case Network.BAOBAB:
      return Blockchain.KLAYTN;
    case Network.SOLANA:
    case Network.SOLANA_DEVNET:
      return Blockchain.SOLANA;
    // case Network.BORA:
    // case Network.BORA_TESTNET:
    //   return Blockchain.BORA;
    // case Network.NEAR:
    // case Network.NEAR_TESTNET:
    //   return Blockchain.NEAR;
  }

  throw new Error(`Unsupported network: ${network}`);
}

export function formatPlatformCoin(balance: BigNumber, network: Network) {
  const blockchain = networkToBlockchain(network);
  if (isEthlikeBlockchain(blockchain)) {
    return utils.formatEther(balance);
  } else {
    return utils.formatUnits(balance, getPlatFormCoinDecimalByBlockchain(blockchain));
  }
}
