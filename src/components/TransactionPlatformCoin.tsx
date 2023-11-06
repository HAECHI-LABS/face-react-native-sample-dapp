import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from 'react-native-ui-lib';
import { providers, utils } from 'ethers';

import Box from './common/Box';
import Button from './common/Button';
import TextField from './common/TextField';
import { accountAtom, faceAtom, networkAtom } from '../store';
import { getExplorerUrl } from '../libs/utils';
import { Alert, Linking } from 'react-native';
import Message from './common/Message';

const title = 'Platform Coin Transaction';
function TransactionPlatformCoin() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [receiverAddress, setReceiverAddress] = useState('');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [face, account]);

  async function sendTransaction() {
    if (!face) {
      return;
    }

    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');
    const signer = await provider.getSigner();

    try {
      const transactionResponse = await signer.sendTransaction({
        to: receiverAddress,
        value: utils.parseUnits(amount),
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
      <TextField
        label={'Amount'}
        value={amount}
        onChange={(amount) => {
          setAmount(amount);
        }}
      />
      <TextField
        label={'Receiver Address'}
        value={receiverAddress}
        onChange={(address) => {
          setReceiverAddress(address);
        }}
      />
      <Button label="Transfer coin" onPress={sendTransaction} />

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

export default TransactionPlatformCoin;
