import { useRecoilValue } from 'recoil';
import { faceAtom, loginStatusAtom } from '../store';
import Box from './common/Box';
import { Text } from 'react-native-ui-lib';
import Button from './common/Button';
import Message from './common/Message';

const title = 'Wallet Home';

function WalletHome() {
  const face = useRecoilValue(faceAtom);
  const isLoggedIn = useRecoilValue(loginStatusAtom);

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must connect to the network first.</Text>
        </Message>
      </Box>
    );
  }

  if (!isLoggedIn) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must log in first.</Text>
        </Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <Button label="Open wallet home" onPress={() => face.wallet.home()} />
    </Box>
  );
}

export default WalletHome;
