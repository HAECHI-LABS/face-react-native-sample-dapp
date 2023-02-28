import { useRecoilValue } from 'recoil';
import { faceAtom, loginStatusAtom } from '../store';
import Box from './common/Box';
import { Checkbox, Text, View } from 'react-native-ui-lib';
import Button from './common/Button';
import Message from './common/Message';
import { useState } from 'react';
import { Blockchain } from '@haechi-labs/face-types';
import { getEnvFromNetwork, getNetworkFromBlockchain } from '../libs/utils';

const title = 'Wallet Home';

function WalletHome() {
  const face = useRecoilValue(faceAtom);
  const isLoggedIn = useRecoilValue(loginStatusAtom);
  const [blockchains, setBlockchains] = useState<Blockchain[]>([]);

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

  function toggleNetwork(blockchain: Blockchain) {
    if (blockchains.includes(blockchain)) {
      setBlockchains(blockchains.filter((b) => b !== blockchain));
    } else {
      setBlockchains([...blockchains, blockchain]);
    }
  }

  const blockchainList = [
    Blockchain.ETHEREUM,
    Blockchain.POLYGON,
    Blockchain.KLAYTN,
    Blockchain.BNB_SMART_CHAIN,
    Blockchain.BORA,
  ];

  return (
    <Box title={title}>
      <View style={{ marginBottom: 10, marginLeft: 5 }}>
        {blockchainList.map((b) => (
          <Checkbox
            key={b}
            label={b}
            color="#3e8ed0"
            value={blockchains.includes(b)}
            onValueChange={() => toggleNetwork(b)}
            style={{ margin: 3 }}
          />
        ))}
      </View>
      <Button label="Open wallet home for all networks" onPress={() => face.wallet.home()} />
      <Button
        label="Open wallet home for selected blockchains"
        onPress={() =>
          face.wallet.home({
            networks: blockchains.map((b) =>
              getNetworkFromBlockchain(b as Blockchain, getEnvFromNetwork(face!.getNetwork()))
            ),
          })
        }
      />
    </Box>
  );
}

export default WalletHome;
