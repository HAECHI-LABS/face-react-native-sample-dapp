import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Text } from 'react-native-ui-lib';
import { providers } from 'ethers';
import Box from './common/Box';
import Button from './common/Button';
import { accountAtom, faceAtom, networkAtom, loginStatusAtom } from '../store';
import { formatPlatformCoin } from '../libs/platformCoin';
import Message from './common/Message';

const title = 'Login with Face Wallet';

function LoginWithFace() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [network, setNetwork] = useRecoilState(networkAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginStatusAtom);

  const getAccountInfo = useCallback(async () => {
    if (!face) {
      return;
    }

    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    console.log('signer init');
    const address = await signer.getAddress();
    console.log('address', address);
    const balance = await signer.getBalance();
    const user = await face.auth.getCurrentUser();

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance, user });
  }, [face, setAccount]);

  useEffect(() => {
    if (!face) {
      return;
    }

    face.auth.isLoggedIn().then((result: any) => {
      setIsLoggedIn(result);

      if (result) {
        getAccountInfo();
      }
    });
  }, [face, getAccountInfo, setIsLoggedIn]);

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
    const res = await face?.auth.login();

    if (!res) {
      return;
    }

    await getAccountInfo();
    setIsLoggedIn(true);
  }

  async function logout() {
    await face?.auth.logout();
    setIsLoggedIn(false);
    setAccount({});
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
          <Button label="Get account info" onPress={getAccountInfo} />
          <Button label="Log out" onPress={logout} />
        </>
      ) : (
        <>
          <Button label="Log in with Face wallet" onPress={login} />
          <Button label="Log out" onPress={logout} />
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
