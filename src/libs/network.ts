import { Blockchain, Env, Network } from '@haechi-labs/face-types';

export function getNetwork(blockchain: Blockchain | null, env: Env) {
  if (blockchain === Blockchain.ETHEREUM) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.GOERLI;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.ETHEREUM;
    }
  }
  if (blockchain === Blockchain.POLYGON) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.MUMBAI;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.POLYGON;
    }
  }
  if (blockchain === Blockchain.BNB_SMART_CHAIN) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.BNB_SMART_CHAIN_TESTNET;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.BNB_SMART_CHAIN;
    }
  }
  if (blockchain === Blockchain.KLAYTN) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.BAOBAB;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.KLAYTN;
    }
  }
  if (blockchain === Blockchain.NEAR) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.NEAR_TESTNET;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.NEAR;
    }
  }
  if (blockchain === Blockchain.SOLANA) {
    switch (env) {
      case Env.Local:
      case Env.Dev:
      case Env.StageTest:
      case Env.ProdTest:
        return Network.SOLANA_DEVNET;
      case Env.StageMainnet:
      case Env.ProdMainnet:
        return Network.SOLANA;
    }
  }
  // if (blockchain == Blockchain.BORA) {
  //   switch (env) {
  //     case Env.Local:
  //     case Env.Dev:
  //     case Env.StageTest:
  //     case Env.ProdTest:
  //       return Network.BORA_TESTNET;
  //     case Env.StageMainnet:
  //     case Env.ProdMainnet:
  //       return Network.BORA;
  //   }
  // }
  return null;
}
