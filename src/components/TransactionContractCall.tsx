import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from 'react-native-ui-lib';
import { providers } from 'ethers';
import { Network } from '@haechi-labs/face-types';
import { Linking, Alert } from 'react-native';
import Box from './common/Box';

import Button from './common/Button';
import TextField from './common/TextField';
import { accountAtom, faceAtom, networkAtom } from '../store';
import { getExplorerUrl } from '../libs/utils';
import Message from './common/Message';

const { alert } = Alert;

export const contractAddressMap: {
  [key: string]: string;
} = {
  [Network.ETHEREUM]: '',
  [Network.SEPOLIA]: '0xAC23B5e3EFc197d24CDc969dA9248cc50f28bF8D',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0xe63c2f4bdd0df2b18b0a4e0210d4b1e95a23dff9',
  [Network.BNB_SMART_CHAIN]: '',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x33d24CdD4a858BC2965568717C7D11eC38650c56',
  [Network.TEZOS]: '',
  [Network.GHOSTNET]: '',
  [Network.KLAYTN]: '',
  [Network.BAOBAB]: '0xfe72540387e1F9aeFAC07D230dAE1865ad2E733c',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: '4TgNWnJcLbCGx1hVMCgFUsWjhuJQuxEMmh8vVapLCKVY',
  [Network.BORA]: '0x5f07F73c6b3B0F02AB5821e7c1a2E3BcF6A78Bc6',
  [Network.BORA_TESTNET]: '0x10791D8c364DC71928e4F1484a5a7344568d6365',
  [Network.NEAR]: 'TODO',
  [Network.NEAR_TESTNET]: 'facewallet.testnet',
  [Network.APTOS]: '0x3c5737e16dad29cc27a159f42bb1302ce5759e78988b3284b3529be2e6247481',
  [Network.APTOS_TESTNET]: '0x3c5737e16dad29cc27a159f42bb1302ce5759e78988b3284b3529be2e6247481',
  [Network.MEVERSE]: 'TODO',
  [Network.MEVERSE_TESTNET]: '0xe6e54bA1d4E38BDDD635231b59F0a4E237596c46',
  [Network.PSM]: 'TODO',
  [Network.PSM_TESTNET]: '0xC3bee40174BF664E2a4ee884b8D631bA5120Ef28',
  [Network.PSM_TESTNET_TEST]: '0xC3bee40174BF664E2a4ee884b8D631bA5120Ef28',
  [Network.PSM_TESTNET_DEV]: '0xC3bee40174BF664E2a4ee884b8D631bA5120Ef28',
  [Network.HOME_VERSE]: 'TODO',
  [Network.HOME_VERSE_TESTNET]: 'TODO',
  [Network.YOOLDO_VERSE]: '0xf4Fd699E9EfD60dFbB5a3127fdD05e54342E7f60',
  [Network.SAND_VERSE]: '0x4fD23Df759732Ec64F4d898971efFc34b4c56d78',
  // OASYS HUB 새로운 스마트 컨트랙트를 배포 못함 https://docs.oasys.games/docs/architecture/hub-layer/hub-layer#smart-contract
  [Network.OASYS]: 'TODO',
  [Network.OASYS_TESTNET]: '0x16B23A1EB0e216b803A8280041fF62f6aFd2B78e',
  [Network.MCH_VERSE]: 'TODO',
  [Network.MCH_VERSE_TESTNET]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.HEDERA]: 'TODO',
  [Network.HEDERA_TESTNET]: '0xe4caf34c99a40d7E4Aa512Ad80f1D9aeF8ef0d01',
  [Network.DEFI_VERSE]: 'TODO',
  [Network.DEFI_VERSE_TESTNET]: '0x08e8814A1dCA1c90DFc93A91f170c2BdCfE25576',
};

const title = 'ContractCall Transaction';

function TransactionContractCall() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [data, setData] = useState('');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [contractAddress, setContractAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [account.address]);

  useEffect(() => {
    // Set default contract address
    if (network) {
      setContractAddress(contractAddressMap[network]);
    }
  }, [network]);

  async function sendTransaction() {
    if (!data) {
      alert('Please enter data');
      return;
    }
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }
    if (!receiverAddress) {
      alert('Please enter receiver address');
      return;
    }

    const provider = new providers.Web3Provider(face!.getEthLikeProvider(), 'any');
    const signer = await provider.getSigner();
    // const myAddress = await signer.getAddress();

    try {
      const transactionResponse = await signer.sendTransaction({
        to: contractAddress,
        value: '0x00',
        data: data,
      });

      setTxHash(transactionResponse.hash);

      console.group('[Transaction Information]');
      console.log('Transaction response:', transactionResponse);
      console.log('Ropsten Link:', `${getExplorerUrl(network!, transactionResponse.hash)}`);

      const receipt = await transactionResponse.wait();
      console.log('Transaction receipt', receipt);
      console.groupEnd();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  }

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must connect to the network first.</Text>
        </Message>
      </Box>
    );
  }
  if (!account.balance || !account.address) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must log in and get account first.</Text>
        </Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <TextField label={'Receiver Address'} value={receiverAddress} onChange={setReceiverAddress} />
      <TextField
        label={'Amount'}
        value={tokenAmount.toString()}
        onChange={(v) => setTokenAmount(Number(v))}
      />
      <TextField label={'Contract Address'} value={contractAddress} onChange={setContractAddress} />
      <TextField label={'Data'} value={data} onChange={setData} />

      <Button label="Contract call" onPress={sendTransaction} />

      {txHash && (
        <Message type="info">
          <Text>Hash: {txHash}</Text>
          <Text onPress={() => Linking.openURL(getExplorerUrl(network!, txHash))}>
            Explorer Link
          </Text>
        </Message>
      )}
    </Box>
  );
}

export default TransactionContractCall;
