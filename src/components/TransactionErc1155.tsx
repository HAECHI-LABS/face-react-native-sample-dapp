import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from 'react-native-ui-lib';
import { BigNumber, providers } from 'ethers';
import { Network } from '@haechi-labs/face-types';
import { Linking, Alert } from 'react-native';
import Box from './common/Box';

import Button from './common/Button';
import TextField from './common/TextField';
import { accountAtom, faceAtom, networkAtom } from '../store';
import { getExplorerUrl, makeErc1155Data } from '../libs/utils';
import Message from './common/Message';

const { alert } = Alert;

export const erc1155ContractAddressMap = {
  [Network.ETHEREUM]: '',
  [Network.SEPOLIA]: '0xF512373412168439B2e587dCfc13e839F0D8472f',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0x174d83e7547624fc9239b68b6ebd685822ef8de9',
  [Network.BNB_SMART_CHAIN]: '',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x6631af506cdc0c78f62cee6913d081a0f50a8707',
  [Network.TEZOS]: 'NOT SUPPORTED',
  [Network.GHOSTNET]: 'NOT SUPPORTED',
  [Network.KLAYTN]: '',
  [Network.BAOBAB]: '0x73b4c267cb84f8437d0cf89c2c98d687d2543a34',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  [Network.NEAR]: 'TODO',
  [Network.NEAR_TESTNET]: 'TODO',
  [Network.BORA]: '0xb6FCfC6c65Be58E2f59530CB357bfeA084C43201',
  [Network.BORA_TESTNET]: '0xfe72540387e1F9aeFAC07D230dAE1865ad2E733c',
  [Network.APTOS]: 'TODO',
  [Network.APTOS_TESTNET]: 'TODO',
  [Network.MEVERSE]: '0xD978b144306Ef63A7243695CCaf51E68e9a950De',
  [Network.MEVERSE_TESTNET]: '0x16B23A1EB0e216b803A8280041fF62f6aFd2B78e',
  [Network.PSM]: 'TODO',
  [Network.PSM_TESTNET]: '0xb1702eFB3E50d7cb02B82b72eFE020FA011921a5',
  [Network.PSM_TESTNET_DEV]: '0xe6F667F97ED03C35Ecab0e5Ae9Fe4C55D57FEE73',
  [Network.PSM_TESTNET_TEST]: '0xe6F667F97ED03C35Ecab0e5Ae9Fe4C55D57FEE73',
  [Network.HOME_VERSE]: '0x4E6BdF2B2c7D3692f7aCaa7b67209976f03e4A05',
  [Network.HOME_VERSE_TESTNET]: '0xAc99E0BB07687A65A0c4EDE872F096a9E1688A40',
  [Network.YOOLDO_VERSE]: '0x77fF8DE13f367E7C73c5F82f590C44fbAf93c434',
  [Network.YOOLDO_VERSE_TESTNET]: '0x00FA1AE8817B8cdDE07B58Ea4140182e2dB4D36d',
  [Network.SAND_VERSE]: '0xcd811021316c19891c47ae6a91E74ecC5FEf9295',
  // OASYS HUB 새로운 스마트 컨트랙트를 배포 못함 https://docs.oasys.games/docs/architecture/hub-layer/hub-layer#smart-contract
  [Network.OASYS]: 'TODO',
  [Network.OASYS_TESTNET]: '0x231234a72478F99c3D1eE0f322bcBA259CAC9412',
  [Network.MCH_VERSE]: 'TODO',
  [Network.MCH_VERSE_TESTNET]: '0x16B23A1EB0e216b803A8280041fF62f6aFd2B78e',
  [Network.HEDERA]: 'TODO',
  [Network.HEDERA_TESTNET]: '0x16b23a1eb0e216b803a8280041ff62f6afd2b78e',
  [Network.DEFI_VERSE]: 'TODO',
  [Network.DEFI_VERSE_TESTNET]: '0xDb1a578f734d5eA2185F8726Fada3745a4c41aE9',
  [Network.KROMA]: 'TODO',
  [Network.KROMA_SEPOLIA]: '0x42fC572Bb3d37f8ac064Cb46290e67a2eC1370d1',
  [Network.LINEA]: 'TODO',
  [Network.LINEA_GOERLI]: '0x00FA1AE8817B8cdDE07B58Ea4140182e2dB4D36d',
  // [Network.ASM]: 'TODO',
  [Network.ASM_QA]: '0x77fF8DE13f367E7C73c5F82f590C44fbAf93c434',
  [Network.ASM_TEST]: '0x77fF8DE13f367E7C73c5F82f590C44fbAf93c434',
  [Network.ASM_DEV]: '0x0f21355B8E29bb84A15326a4647929205e837d3f',
  [Network.ASM_STAGE]: '0x00FA1AE8817B8cdDE07B58Ea4140182e2dB4D36d',
};

const title = 'ERC1155 Transaction';

function TransactionErc1155() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenAmount, setTokenAmount] = useState(10);
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
      setContractAddress(erc1155ContractAddressMap[network]);
    }
  }, [network]);

  async function sendTransaction() {
    if (!tokenId) {
      alert('Please enter token ID');
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
    const myAddress = await signer.getAddress();

    try {
      const transactionResponse = await signer.sendTransaction({
        to: contractAddress,
        value: '0x00',
        data: makeErc1155Data(
          'safeTransferFrom',
          myAddress,
          receiverAddress,
          BigNumber.from(tokenId),
          BigNumber.from(tokenAmount)
        ),
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
      <TextField label={'Token ID'} value={tokenId} onChange={setTokenId} />
      <TextField
        label={'Token Amount'}
        value={tokenAmount.toString()}
        onChange={(v) => setTokenAmount(Number(v))}
      />
      <TextField label={'Contract Address'} value={contractAddress} onChange={setContractAddress} />
      <TextField label={'Receiver Address'} value={receiverAddress} onChange={setReceiverAddress} />
      <Button label="Transfer ERC1155 token" onPress={sendTransaction} />

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

export default TransactionErc1155;
