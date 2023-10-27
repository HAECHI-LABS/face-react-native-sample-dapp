import {
  BoraPortalConnectRequest,
  BoraPortalConnectStatusResponse,
  LoginProviderType,
  Network,
} from '@haechi-labs/face-types';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Text } from 'react-native-ui-lib';
import { getAccountInfo } from '../libs/accountInfo';
import { getCustomLoginCredential } from '../libs/auth';
import { createSignature } from '../libs/encrypt';
import { accountAtom, faceAtom, loginStatusAtom, networkAtom, privateKeyAtom } from '../store';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';
import TextField from './common/TextField';

const title = 'BoraPortal';

function BoraPortal() {
  const face = useRecoilValue(faceAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const network = useRecoilValue(networkAtom);
  const prvKey = useRecoilValue(privateKeyAtom);
  const [connectInfo, setConnectInfo] = useState<BoraPortalConnectStatusResponse>();
  const [error, setError] = useState<string | null>(null);
  const [bappUsn, setBppUsn] = useState<string | null>(null);
  const setIsLoggedIn = useSetRecoilState(loginStatusAtom);

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

  const getAccountInfoCallback = useCallback(async () => {
    if (!face) {
      return null;
    }

    const { address, balance, user } = await getAccountInfo(face, network!);

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance, user });
  }, [face, network, setAccount]);

  async function boraLogin() {
    if (!bappUsn) {
      console.error('Please enter bappUsn.');
      return;
    }
    try {
      const signatureMessage = `boraconnect:${bappUsn}`;
      const res = await face?.auth.boraLogin({
        bappUsn,
        signature: createSignature(signatureMessage, prvKey),
      });
      // setSession((res as any).session);
      setIsLoggedIn(true);
      getAccountInfoCallback();
      console.log('Login response:', res);
    } catch (e) {
      if (e.isFaceError && e.code === 4001) {
        console.log('User rejected!');
        return;
      }
      throw e;
    }
  }

  async function boraDirectSocialLogin(provider: LoginProviderType) {
    try {
      if (!bappUsn) {
        console.error('Please enter bappUsn.');
        return;
      }
      const signatureMessage = `boraconnect:${bappUsn}`;
      const res = await face?.auth.boraDirectSocialLogin(
        {
          bappUsn,
          signature: createSignature(signatureMessage, prvKey),
        },
        provider
      );
      console.log('Social Login response:', res);
      setIsLoggedIn(true);
      getAccountInfoCallback();
    } catch (e) {
      if (e.isFaceError && e.code === 4001) {
        console.log('User rejected!');
        return;
      }
      throw e;
    }
  }

  async function boraLoginWithIdToken(provider: LoginProviderType) {
    if (!bappUsn) {
      console.error('Please enter bappUsn.');
      return;
    }
    const signatureMessage = `boraconnect:${bappUsn}`;
    const credential = await getCustomLoginCredential(provider);
    if (credential) {
      const boraRequest = {
        bappUsn,
        signature: createSignature(signatureMessage, prvKey),
      };
      const response = await face?.auth.boraLoginWithIdToken(boraRequest, {
        idToken: credential.idToken,
        sig: credential.signature,
      });
      console.log('Face Wallet Login Succeed:', response);
      setIsLoggedIn(true);
      getAccountInfoCallback();
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
      <Button label="[Bora] login" onPress={() => boraLogin()} />
      <Button
        label="[Bora] direct social login (google.com)"
        onPress={() => boraDirectSocialLogin('google.com')}
      />
      <Button
        label="[Bora] login with id token (google.com)"
        onPress={() => boraLoginWithIdToken('google.com')}
      />
      <Button label="isBoraConnected" onPress={() => isBoraConnected()} />
      <Button label="Connect" onPress={() => connectBora()} />
    </Box>
  );
}

export default BoraPortal;
