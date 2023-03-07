import {
  BoraPortalConnectRequest,
  BoraPortalConnectStatusResponse,
  Network,
} from '@haechi-labs/face-types';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { privateKeyAtom, accountAtom, faceAtom, networkAtom } from '../store';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';
import TextField from './common/TextField';
import { Text } from 'react-native-ui-lib';
import { createSignature } from '../libs/encrypt';

const title = 'BoraPortal';

function BoraPortal() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const prvKey = useRecoilValue(privateKeyAtom);
  const [connectInfo, setConnectInfo] = useState<BoraPortalConnectStatusResponse>();
  const [error, setError] = useState<string | null>(null);
  const [bappUsn, setBppUsn] = useState<string | null>(null);

  useEffect(() => {
    if (account == null || account.user?.faceUserId == null) {
      return;
    }
    setBppUsn(account.user?.faceUserId);
  }, [account]);

  async function isBoraConnected() {
    try {
      setError(null);
      const response = await face?.bora.isConnected(bappUsn!);
      console.group('[IsBoraConnected]');
      console.log('response:', response);
      console.groupEnd();

      if (response?.status) {
        setConnectInfo(response);
      }
    } catch (e) {
      setConnectInfo(undefined);
      setError(e.message);
      console.error(e);
    }
  }

  async function connectBora() {
    setError(null);
    try {
      const signatureMessage = `${bappUsn}:${account.user?.wallet?.address}`;
      const response = await face?.bora.connect({
        bappUsn,
        signature: createSignature(signatureMessage, prvKey),
      } as BoraPortalConnectRequest);
      console.group('[ConnectBora]');
      console.log('rawMessage:', signatureMessage);
      console.log('signature:', createSignature(signatureMessage, prvKey));
      console.log('response:', response);
      console.groupEnd();

      if (response?.status) {
        setConnectInfo(response);
      }
    } catch (e) {
      setConnectInfo(undefined);
      setError(e.message);
      console.error(e);
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
  } else {
    if (Network.BORA_TESTNET !== network) {
      return (
        <Box title={title}>
          <Message type="danger">
            <Text>To test the BoraPortal API, you must connect to the Bora Testnet.</Text>
          </Message>
        </Box>
      );
    }
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
      {connectInfo && (
        <Message type="info">
          {connectInfo.status && <Text>status: {connectInfo.status}</Text>}
          {connectInfo.bappUsn && <Text>bappUsn: {connectInfo.bappUsn}</Text>}
          {connectInfo.boraPortalUsn && <Text>boraPortalUsn: {connectInfo.boraPortalUsn}</Text>}
          {connectInfo.walletAddressHash && (
            <Text>walletAddressHash: {connectInfo.walletAddressHash}</Text>
          )}
        </Message>
      )}
      {error && (
        <Message type="danger">
          <Text>{error}</Text>
        </Message>
      )}
      <TextField
        label={'Receiver Address'}
        value={bappUsn ?? ''}
        onChange={(address) => {
          setBppUsn(address);
        }}
      />
      <Button label="isConnected" onPress={() => isBoraConnected()} />
      <Button label="Connect" onPress={() => connectBora()} />
    </Box>
  );
}

export default BoraPortal;
