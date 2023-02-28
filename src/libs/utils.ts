import { Blockchain, Env, Network } from '@haechi-labs/face-types';
import { BigNumber, ethers } from 'ethers';

import { ERC20_ABI, ERC721_TRANSFER_ABI, ERC1155_TRANSFER_ABI } from './abi';

export function makeErc20Data(functionFragment: string, to: string, value: BigNumber) {
  const ethersInterface = new ethers.utils.Interface(ERC20_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [to, value]);
}

export function makeErc721Data(
  functionFragment: string,
  from: string,
  to: string,
  tokenId: BigNumber
) {
  const ethersInterface = new ethers.utils.Interface(ERC721_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [from, to, tokenId]);
}

export function makeErc1155Data(
  functionFragment: string,
  from: string,
  to: string,
  tokenId: BigNumber,
  amount: BigNumber
) {
  const ethersInterface = new ethers.utils.Interface(ERC1155_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [from, to, tokenId, amount, '0x00']);
}

export function getExplorerUrl(network: Network, transactionHash: string): string {
  const explorerMap: { [key: string]: string } = {
    [Network.ETHEREUM]: `https://etherscan.io/tx/${transactionHash}`,
    [Network.ROPSTEN]: `https://ropsten.etherscan.io/tx/${transactionHash}`,
    [Network.GOERLI]: `https://goerli.etherscan.io/tx/${transactionHash}`,
    [Network.POLYGON]: `https://polygonscan.com/tx/${transactionHash}`,
    [Network.MUMBAI]: `https://mumbai.polygonscan.com/tx/${transactionHash}`,
    [Network.BNB_SMART_CHAIN]: `https://bscscan.com/tx/${transactionHash}`,
    [Network.BNB_SMART_CHAIN_TESTNET]: `https://testnet.bscscan.com/tx/${transactionHash}`,
    [Network.KLAYTN]: `https://www.klaytnfinder.io/tx/${transactionHash}`,
    [Network.BAOBAB]: `https://baobab.klaytnfinder.io/tx/${transactionHash}`,
    [Network.SOLANA]: `https://explorer.solana.com/tx/${transactionHash}`,
    [Network.SOLANA_DEVNET]: `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`,
    // [Network.NEAR]: `https://explorer.near.org/transactions/${transactionHash}`,
    // [Network.NEAR_TESTNET]: `https://explorer.testnet.near.org/transactions/${transactionHash}`,
    // [Network.BORA]: `https://scope.boraportal.com/${transactionHash}`,
    // [Network.BORA_TESTNET]: `https://scope.boraportal.com/${transactionHash}`,
  };

  return explorerMap[network];
}

export function getProvider(network: Network) {
  switch (network) {
    case Network.ROPSTEN:
      return 'https://eth-ropsten.alchemyapi.io/v2/UghLajTzDNBAO9EByRXWmIqduze2_jJ2';
    case Network.GOERLI:
      return 'https://goerli.infura.io/v3/ac003ee08b5644ce9d2bc7779de3a43b';
    case Network.ETHEREUM:
      return 'https://mainnet.infura.io/v3/';
    case Network.MUMBAI:
      return 'https://matic-mumbai.chainstacklabs.com';
    case Network.POLYGON:
      return 'https://polygon-rpc.com/';
    case Network.BNB_SMART_CHAIN:
      return 'https://bsc-dataseed.binance.org/';
    case Network.BNB_SMART_CHAIN_TESTNET:
      return 'https://data-seed-prebsc-1-s1.binance.org:8545/';
    case Network.KLAYTN:
      return 'https://public-node-api.klaytnapi.com/v1/cypress';
    case Network.BAOBAB:
      return 'https://api.baobab.klaytn.net:8651/';
      // case Network.BORA:
      //   return 'https://public-node.api.boraportal.io/bora/mainnet';
      // case Network.BORA_TESTNET:
      return 'https://public-node.api.boraportal.io/bora/testnet';
    case Network.SOLANA_DEVNET:
      return 'https://api.devnet.solana.com';
    case Network.SOLANA:
      return 'https://api.mainnet-beta.solana.com';
    default:
      throw Error(`cannot resolve provider with network : ${network}`);
  }
}

export async function getGasPrice(network: Network): Promise<string> {
  return (
    await new ethers.providers.JsonRpcProvider(getProvider(network)).getGasPrice()
  ).toHexString();
}

export function getNetworkFromBlockchain(blockchain: Blockchain, env: Env): Network {
  if (isMainnet(env)) {
    switch (blockchain) {
      case Blockchain.ETHEREUM:
        return Network.ETHEREUM;
      case Blockchain.POLYGON:
        return Network.POLYGON;
      case Blockchain.BNB_SMART_CHAIN:
        return Network.BNB_SMART_CHAIN;
      case Blockchain.KLAYTN:
        return Network.KLAYTN;
      case Blockchain.SOLANA:
        return Network.SOLANA;
      case Blockchain.NEAR:
        return Network.NEAR;
      case Blockchain.BORA:
        return Network.BORA;
      case Blockchain.APTOS:
        return Network.APTOS;
    }
  } else {
    switch (blockchain) {
      case Blockchain.ETHEREUM:
        return Network.GOERLI;
      case Blockchain.POLYGON:
        return Network.MUMBAI;
      case Blockchain.BNB_SMART_CHAIN:
        return Network.BNB_SMART_CHAIN_TESTNET;
      case Blockchain.KLAYTN:
        return Network.BAOBAB;
      case Blockchain.SOLANA:
        return Network.SOLANA_DEVNET;
      case Blockchain.NEAR:
        return Network.NEAR_TESTNET;
      case Blockchain.BORA:
        return Network.BORA_TESTNET;
      case Blockchain.APTOS:
        return Network.APTOS_TESTNET;
    }
  }
  throw new Error('Unsupported blockchain ' + blockchain);
}

export function isMainnet(env: Env) {
  switch (env) {
    case Env.ProdMainnet:
    case Env.StageMainnet:
      return true;
    default:
      return false;
  }
}

export function getEnvFromNetwork(network: Network): Env {
  if (isMainnetNetwork(network)) {
    return Env.ProdMainnet;
  }

  return Env.ProdTest;
}

export function isMainnetNetwork(network: Network) {
  switch (network) {
    case Network.ETHEREUM:
    case Network.POLYGON:
    case Network.BNB_SMART_CHAIN:
    case Network.KLAYTN:
    case Network.SOLANA:
    case Network.BORA:
    case Network.NEAR:
      return true;
    default:
      return false;
  }
}
