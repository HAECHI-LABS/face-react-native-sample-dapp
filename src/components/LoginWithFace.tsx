import { LoginProviderType } from '@haechi-labs/face-types';
import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Text } from 'react-native-ui-lib';

import Box from './common/Box';
import Button from './common/Button';
import { accountAtom, faceAtom, networkAtom, loginStatusAtom } from '../store';
import { formatPlatformCoin } from '../libs/platformCoin';
import Message from './common/Message';
import { getAccountInfo } from '../libs/accountInfo';

const title = 'Login with Face Wallet';

function LoginWithFace() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [network, setNetwork] = useRecoilState(networkAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginStatusAtom);

  const getAccountInfoCallback = useCallback(async () => {
    if (!face) {
      return;
    }

    const { address, balance, user } = await getAccountInfo(face, network!);

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance, user });
  }, [face, network, setAccount]);

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must connect to the network first.</Text>
        </Message>
      </Box>
    );
  }

  async function login() {
    const result = await face?.auth.login();

    if (result === null) {
      console.log('Login is canceled');
      return;
    }

    await getAccountInfoCallback();
    setIsLoggedIn(true);
  }

  async function socialLogin(provider: LoginProviderType) {
    const result = await face?.auth.directSocialLogin(provider);

    if (result === null) {
      console.log('Login is canceled');
      return;
    }

    await getAccountInfoCallback();
    setIsLoggedIn(true);
  }

  async function logout() {
    await face?.auth.logout();
    setIsLoggedIn(false);
    setAccount({});
    resetFaceSDK();
  }

  function resetFaceSDK() {
    setNetwork(null);
    setFace(null);
  }

  return (
    <Box title={title}>
      {isLoggedIn ? (
        <>
          {account.balance && <Text />}
          {account.balance && (
            <Message type="info">
              <Text text80BO>Account Info</Text>
              <Text>Address: {account.address}</Text>
              <Text>Balance: {formatPlatformCoin(account.balance, network!)}</Text>
            </Message>
          )}
          <Button label="Get account info" onPress={getAccountInfoCallback} />
          <Button label="Log out" onPress={logout} />
        </>
      ) : (
        <>
          <Button label="Log in with Face wallet" onPress={login} />
          <Button label="Google login" onPress={() => socialLogin('google.com')} />
          <Button label="Apple login" onPress={() => socialLogin('apple.com')} />
          <Button label="Facebook login" onPress={() => socialLogin('facebook.com')} />
          <Button label="Reset Face SDK" onPress={resetFaceSDK} />
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
