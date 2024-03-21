import { LoginProviderType, Network } from '@haechi-labs/face-types';
import { useCallback } from 'react';
import { Text } from 'react-native-ui-lib';
import { useRecoilState, useRecoilValue } from 'recoil';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAccountInfo } from '../libs/accountInfo';
import { getCustomLoginCredential } from '../libs/auth';
import { formatPlatformCoin } from '../libs/platformCoin';
import { accountAtom, faceAtom, loginStatusAtom, networkAtom } from '../store';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';
import { Alert } from 'react-native';
import { envAtom } from '../store/envAtom';

const title = 'Login with Face Wallet';

GoogleSignin.configure({
  webClientId: '40429402374-fe00il2cm311b4qbk76k2qdep4v43tti.apps.googleusercontent.com',
  offlineAccess: true,
});

function LoginWithFace() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [network, setNetwork] = useRecoilState(networkAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginStatusAtom);
  const env = useRecoilValue(envAtom);

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

  const loginWithCustomToken = useCallback(
    async (provider: LoginProviderType) => {
      try {
        const credential = await getCustomLoginCredential(provider, env);
        if (!credential) return;
        const result = await face?.auth.loginWithIdToken({
          idToken: credential.idToken,
          sig: credential.signature,
        });

        if (result === null) {
          console.log('Login is canceled');
          return;
        }

        await getAccountInfoCallback();
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', e.message);
      }
    },
    [env, face?.auth, getAccountInfoCallback, setIsLoggedIn]
  );

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must connect to the network first.</Text>
        </Message>
      </Box>
    );
  }

  const login = async () => {
    try {
      const result = await face?.auth.login();

      if (result === null) {
        console.log('Login is canceled');
        return;
      }

      await getAccountInfoCallback();
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  };

  async function socialLogin(provider: LoginProviderType) {
    try {
      const result = await face?.auth.directSocialLogin(provider);

      if (result === null) {
        console.log('Login is canceled');
        return;
      }

      await getAccountInfoCallback();
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  }

  async function logout() {
    try {
      await face?.auth.logout();
      setIsLoggedIn(false);
      setAccount({});
      resetFaceSDK();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  }

  function resetFaceSDK() {
    setNetwork(Network.ETHEREUM);
    setFace(null);
  }

  return (
    <Box title={title}>
      {isLoggedIn ? (
        <>
          {account.balance && <Text />}
          {account.balance && (
            <Message type="info">
              <Text accessibilityLabel={'Login result'}>Login Success</Text>
              <Text text80BO>Account Info</Text>
              <Text>Address: {account.address}</Text>
              <Text>Balance: {formatPlatformCoin(account.balance, network!)}</Text>
              <Text>UserVerificationToken: {account.user.userVerificationToken}</Text>
            </Message>
          )}
          <Button label="Get account info" onPress={getAccountInfoCallback} />
          <Button label="Log out" onPress={logout} />
        </>
      ) : (
        <>
          <Button
            label="Log in with Face wallet"
            onPress={login}
            accessibilityLabel={'open login modal'}
          />
          <Button label="Google login" onPress={() => socialLogin('google.com')} />
          <Button label="Apple login" onPress={() => socialLogin('apple.com')} />
          <Button label="Facebook login" onPress={() => socialLogin('facebook.com')} />
          <Button
            label="LoginWithIdToken (Google)"
            onPress={() => loginWithCustomToken('google.com')}
          />
          <Button
            label="LoginWithIdToken (Apple)"
            onPress={() => loginWithCustomToken('apple.com')}
          />
          <Button
            label="LoginWithIdToken (Kakao)"
            onPress={() => loginWithCustomToken('kakao.com')}
          />
          <Button label="Reset Face SDK" onPress={resetFaceSDK} />
          <Button accessibilityLabel="Log out" label="Log out" onPress={logout} />
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
