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

export const erc1155ContractAddressMap: { [key: string]: string } = {
  [Network.ETHEREUM]: '',
  [Network.ROPSTEN]: '',
  [Network.SEPOLIA]: '0xF512373412168439B2e587dCfc13e839F0D8472f',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0x174d83e7547624fc9239b68b6ebd685822ef8de9',
  [Network.BNB_SMART_CHAIN]: '',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x6631af506cdc0c78f62cee6913d081a0f50a8707',
  [Network.KLAYTN]: '',
  [Network.BAOBAB]: '0x73b4c267cb84f8437d0cf89c2c98d687d2543a34',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  // [Network.NEAR]: 'TODO',
  // [Network.NEAR_TESTNET]: 'TODO',
  // [Network.BORA]: '0xb6FCfC6c65Be58E2f59530CB357bfeA084C43201',
  // [Network.BORA_TESTNET]: '0xfe72540387e1F9aeFAC07D230dAE1865ad2E733c',
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
