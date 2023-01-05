import { ethers, providers } from 'ethers';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accountAtom, faceAtom } from '../store';
import Box from './common/Box';
import { Text, View } from 'react-native-ui-lib';
import Button from './common/Button';
import TextField from './common/TextField';
import Message from './common/Message';

const title = 'Sign Message';

function SignMessage() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  async function signMessage() {
    const provider = new providers.Web3Provider(face!.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const response = await signer.signMessage(message);
    const _verificationResult = ethers.utils.verifyMessage(message, response);

    console.group('[Sign Information]');
    console.log('Signed message:', response);
    console.log('Verification result:', response);
    console.groupEnd();
    setSignedMessage(response);
    setVerificationResult(_verificationResult);
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
      <TextField label={'Message'} value={message} onChange={setMessage} />
      <Button label="Sign Message" onPress={() => signMessage()} />

      {signedMessage && (
        <View>
          <Text>Signed message</Text>
          <Text>{signedMessage}</Text>
          <Text>Verification result</Text>
          <Text>{verificationResult}</Text>
        </View>
      )}
    </Box>
  );
}

export default SignMessage;
