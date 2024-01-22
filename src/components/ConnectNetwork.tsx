import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Text } from 'react-native-ui-lib';
import Box from './common/Box';
import Picker from './common/Picker';
import Button from './common/Button';
import { faceAtom, networkAtom } from '../store';
import { Face } from '@haechi-labs/face-react-native-sdk';
import { Blockchain, Env, NetworkChainIdMap, Network } from '@haechi-labs/face-types';
import { PROD_MAINNET_API_KEY, TEST_API_KEY } from '../contants/apiKey';
import { getNetwork } from '../libs/network';
import TextField from './common/TextField';
import Message from './common/Message';
import { Alert, Platform } from 'react-native';
import Hr from './common/Hr';
import { envAtom } from '../store/envAtom';

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
  Blockchain.BORA,
  // Blockchain.NEAR,
  // Blockchain.SOLANA,
];

const title = 'Connect Network';

function ConnectNetwork() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [network, setNetwork] = useRecoilState(networkAtom);
  const [blockchain, setBlockchain] = useState<Blockchain>(Blockchain.ETHEREUM);
  const [env, setEnv] = useRecoilState<Env>(envAtom);
  const [apiKey, setApiKey] = useState<string>(TEST_API_KEY);
  const [chainId, setChainId] = useState('');
  const [multiStageId, setMultiStageId] = useState('');

  const isFaceInitialized = !!face;

  useEffect(() => {
    if (env == null) {
      return;
    }

    if (env !== Env.ProdMainnet) {
      setApiKey(TEST_API_KEY);
    } else {
      setApiKey(PROD_MAINNET_API_KEY);
    }
  }, [env]);

  const connectNetwork = () => {
    const network = getNetwork(blockchain, env);
    setNetwork(network);

    let iframeUrl;
    if (env === Env.Local) {
      iframeUrl = Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://10.0.2.2:3333';
    } else if (env === Env.StageTest || env === Env.StageMainnet) {
      iframeUrl = multiStageId
        ? `https://face-iframe-${multiStageId}.facewallet-test.xyz/`
        : undefined;
    }

    try {
      if (isFaceInitialized) {
        face?.switchNetwork(network as Network);
      } else {
        const face = new Face({
          apiKey,
          network,
          env,
          scheme: 'facewebview',
          iframeUrl,
        } as never);
        setFace(face);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
      console.error('Error occurred', e);
    }
  };

  const connectWithChainId = () => {
    const _chainId = Number(chainId);
    setNetwork(NetworkChainIdMap[_chainId] as Network);
    try {
      if (isFaceInitialized) {
        face.switchNetwork(_chainId);
      } else {
        const face = new Face({
          apiKey: apiKey,
          network: _chainId,
          env,
          scheme: 'facewebview',
          ...(env === Env.Local
            ? {
                iframeUrl: Platform.OS === 'ios' ? 'http://localhost:3333' : 'http://10.0.2.2:3333',
              }
            : {}),
        } as never);
        setFace(face);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  };

  const action = isFaceInitialized ? 'Switch' : 'Connect';
  return (
    <Box title={title}>
      {isFaceInitialized && (
        <Message type="info">
          <Text text80BO>Connected to {network}</Text>
          <Text>Env: {env}</Text>
        </Message>
      )}

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
      <TextField label={'MultiStage ID'} value={multiStageId} onChange={setMultiStageId} />
      <TextField label={'Api Key'} value={apiKey} onChange={setApiKey} />
      <Button
        label={`${action} network`}
        onPress={connectNetwork}
        accessibilityLabel={`${action} network`}
      />

      <Hr />

      <TextField label={'Chain ID'} value={chainId} onChange={setChainId} />
      <Button label={`${action} network with Chain ID`} onPress={connectWithChainId} />
    </Box>
  );
}

export default ConnectNetwork;
