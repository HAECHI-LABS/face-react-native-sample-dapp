import { LoginProviderType } from '@haechi-labs/face-types';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Text } from 'react-native-ui-lib';

import forge from 'node-forge';
import Box from './common/Box';
import Button from './common/Button';
import { accountAtom, faceAtom, networkAtom, loginStatusAtom } from '../store';
import { formatPlatformCoin } from '../libs/platformCoin';
import Message from './common/Message';
import { getAccountInfo } from '../libs/accountInfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ethers } from 'ethers';

const title = 'Login with Face Wallet';

GoogleSignin.configure({
  webClientId: '40429402374-fe00il2cm311b4qbk76k2qdep4v43tti.apps.googleusercontent.com',
});

const PRV_KEY =
  'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJLbedwNLvHyeZO4rUUU3QR9ijS+jrGFMEwE1ZVtCy5+/rRfyG/f5NsBDckjIwSEuj5z7fWhiu+tDQbZ72PzK8lgRScu4T49oAGjTLdXmb2D+p1MHmn14R+pmUOtxSXXNSvhbusnAXCROUAVIo6pUI+ebyjOZwzLKsQeCXYBt6GtAgMBAAECgYAEfQa9bf24UVPb6vIIwXl70KZvtD9CN7LhL+ijN4D2+9SnCKJkoPAqrV6Rfixsz+2tSPfF4RkQ+DYEtpZ1dJIq+kNxqRjb7TEHcduYYQwgkJZe2LPd1LS5bnvLGSbGMHHy7+MYNm6M/ghdHoDU+tkYLNFT19BX7MKbBWQPpoH/gQJBAJllv/CZQBhofxLZO0xsM8xcxTo3MFQoos89+Kdym+a8i/WqD49IgIsiK3adn/GCtjSeKJhPlrd5iNUqTBywUk0CQQD1Fdv9q++RmpuhD6LQtGzeeoNzld7xRjWjHVwHvp7/6xeSCyO8sHKydUF/NmV+Jy8vFpJn6b1AvagtgqALanzhAkBaP1eeWLsx4QCp+S3+90W+PPI4HtILIWEv5jjNYws/w7vgC25eEPy3XqINhgzcjNdfu5EMkv6L8S/Eob7nvgCdAkALF4ArTNq8xjiA44pE08WRlA3a7091r+3BghSmLRRZFLSuYV6urXWjafca4MVbHj7ebLEXjtaH1Y2E8cJ4gctBAkBPXs2bRZpI5ULwyYknWaq77gfuappmShgiCv7TUKixt5KqZy8DUU13x/WTUCWjthF/lmgkVq+FvsnG49dF8TM7';

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

  function createPemFromApiKey(privateKey: string): string {
    return `-----BEGIN RSA PRIVATE KEY-----\n${privateKey
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/(\S{64}(?!$))/g, '$1\n')}\n-----END RSA PRIVATE KEY-----\n`;
  }

  function createSignatureForIdToken(idToken: string) {
    const messageDigest = forge.md.sha256.create();
    messageDigest.update(idToken, 'utf8');
    const privateKey = forge.pki.privateKeyFromPem(createPemFromApiKey(PRV_KEY));
    const arrayBuffer = forge.util.binary.raw.decode(privateKey.sign(messageDigest));
    return ethers.utils.base64.encode(arrayBuffer);
  }

  async function customTokenLogin() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.idToken) {
        const signature = createSignatureForIdToken(userInfo.idToken) as string;
        const result = await face?.auth.loginWithIdToken({
          idToken: userInfo.idToken,
          sig: signature,
        });

        if (result === null) {
          console.log('Login is canceled');
          return;
        }

        await getAccountInfoCallback();
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log({ error });
    }
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
          <Button label="LoginWithIdToken (Google)" onPress={() => customTokenLogin()} />
          <Button label="Reset Face SDK" onPress={resetFaceSDK} />
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
