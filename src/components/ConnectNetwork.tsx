import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Text } from 'react-native-ui-lib';
import Box from './common/Box';
import Picker from './common/Picker';
import Button from './common/Button';
import { faceAtom, networkAtom } from '../store';
import { Face } from '@haechi-labs/face-react-native-sdk';
import { Blockchain, Env } from '@haechi-labs/face-types';
import { API_KEY } from '../contants/apiKey';
import { getNetwork } from '../libs/network';
import TextField from './common/TextField';
import Message from './common/Message';
import { Platform } from 'react-native';

const envList = [
  Env.Local,
  Env.Dev,
  Env.StageTest,
  Env.StageMainnet,
  Env.ProdTest,
  Env.ProdMainnet,
];

const blockchainList = [
  Blockchain.ETHEREUM,
  Blockchain.POLYGON,
  Blockchain.BNB_SMART_CHAIN,
  Blockchain.KLAYTN,
  Blockchain.SOLANA,
];

const title = 'Connect Network';

function ConnectNetwork() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [network, setNetwork] = useRecoilState(networkAtom);
  const [blockchain, setBlockchain] = useState<Blockchain>(Blockchain.ETHEREUM);
  const [env, setEnv] = useState<Env>(envList[1]);
  const [apiKey, setApiKey] = useState<string>(API_KEY);

  const connect = () => {
    const network = getNetwork(blockchain, env);

    setNetwork(network);

    try {
      const face = new Face({
        apiKey,
        network,
        env,
        ...(env === Env.Local
          ? { iframeUrl: Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://10.0.2.2:3333' }
          : {}),
      } as never);
      setFace(face);
    } catch (e) {
      console.log('Error occurred');
    }
  };

  if (face) {
    return (
      <Box title={title}>
        <Message type="info">
          <Text text80BO>Connected to {network}</Text>
          <Text>Env: {env}</Text>
          <Text>Blockchain: {blockchain}</Text>
        </Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <Picker
        title="Env"
        value={env}
        items={envList}
        onChange={(value) => {
          setEnv(value as Env);
        }}
      />
      <Picker
        title="Blockchain"
        value={blockchain}
        items={blockchainList}
        onChange={(value) => {
          setBlockchain(value as Blockchain);
        }}
      />
      <TextField label={'Api Key'} value={apiKey} onChange={setApiKey} />

      <Button label="Connect network" onPress={connect} />
    </Box>
  );
}

export default ConnectNetwork;
