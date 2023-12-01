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
import { getExplorerUrl, makeErc721Data } from '../libs/utils';
import Message from './common/Message';

const { alert } = Alert;

export const erc721ContractAddressMap: { [key: string]: string } = {
  [Network.ETHEREUM]: '',
  [Network.ROPSTEN]: '',
  [Network.SEPOLIA]: '0x63C1664c1Ee107D762C7ed7517Ca1cD25bc33C0b',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0x1CB4d2F2055299ca23BC310260ABaf72C5ACe800',
  [Network.BNB_SMART_CHAIN]: '0xb3484b204c96b366e1004e94bc50fe637322da47',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x2d65997da649f79ff79ac49501d786cc4973a715',
  [Network.KLAYTN]: '0xa2fab648f2cfd5cea88492808214fce0cca15b5e',
  [Network.BAOBAB]: '0x7059f425113f6630bd3871d778f0c289939a0da8',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  // [Network.NEAR]: 'TODO',
  // [Network.NEAR_TESTNET]: 'TODO',
  // [Network.BORA]: '0x646ea0705805AE57C3500d6EC46BF982Fa88ed83',
  // [Network.BORA_TESTNET]: '0x0F2585C209Fc272ad29b9c945766A0F7C45db7a0',
};

const title = 'ERC721 Transaction';

function TransactionErc721() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [tokenId, setTokenId] = useState('');
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
      setContractAddress(erc721ContractAddressMap[network]);
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
        data: makeErc721Data('transferFrom', myAddress, receiverAddress, BigNumber.from(tokenId)),
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
      <TextField label={'Contract Address'} value={contractAddress} onChange={setContractAddress} />
      <TextField label={'Receiver Address'} value={receiverAddress} onChange={setReceiverAddress} />
      <Button label="Transfer ERC721 token" onPress={sendTransaction} />

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

export default TransactionErc721;
