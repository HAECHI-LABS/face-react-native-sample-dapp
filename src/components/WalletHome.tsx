import { useRecoilValue } from 'recoil';
import { faceAtom, loginStatusAtom } from '../store';
import Box from './common/Box';
import { Checkbox, Text, View } from 'react-native-ui-lib';
import Button from './common/Button';
import Message from './common/Message';
import { useState } from 'react';
import { Network } from '@haechi-labs/face-types';

const title = 'Wallet Home';

function WalletHome() {
  const face = useRecoilValue(faceAtom);
  const isLoggedIn = useRecoilValue(loginStatusAtom);
  const [networks, setNetworks] = useState<Network[]>([]);

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

  function toggleNetwork(network: Network) {
    if (networks.includes(network)) {
      setNetworks(networks.filter((b) => b !== network));
    } else {
      setNetworks([...networks, network]);
    }
  }

  const networkList = Object.values(Network);

  return (
    <Box title={title}>
      <View style={{ marginBottom: 10, marginLeft: 5 }}>
        {networkList.map((b) => (
          <Checkbox
            key={b}
            label={b}
            color="#3e8ed0"
            value={networks.includes(b)}
            onValueChange={() => toggleNetwork(b)}
            style={{ margin: 3 }}
          />
        ))}
      </View>
      <Button label="Open wallet home for all networks" onPress={() => face.wallet.home()} />
      <Button
        label="Open wallet home for selected networks"
        onPress={() => face.wallet.home({ networks })}
      />
    </Box>
  );
}

export default WalletHome;
