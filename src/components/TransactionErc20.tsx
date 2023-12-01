import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from 'react-native-ui-lib';
import { ethers, providers, utils } from 'ethers';
import { Network } from '@haechi-labs/face-types';
import { Linking, Alert } from 'react-native';

import Box from './common/Box';
import Button from './common/Button';
import TextField from './common/TextField';
import { accountAtom, faceAtom, networkAtom } from '../store';
import { getExplorerUrl, makeErc20Data } from '../libs/utils';
import { ERC20_ABI } from '../libs/abi';
import Message from './common/Message';
import Picker from './common/Picker';

const { alert } = Alert;

export const erc20Decimal18ContractAddressMap: {
  [key: string]: string;
} = {
  [Network.ETHEREUM]: '0x8A904F0Fb443D62B6A2835483b087aBECF93a137',
  [Network.ROPSTEN]: '',
  [Network.SEPOLIA]: '0xfCe04dd232006d0da001F6D54Bb5a7fC969dBc08',
  [Network.POLYGON]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.MUMBAI]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.BNB_SMART_CHAIN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x4c253d0f5de4dac61c5355aaa3efe0872dfadfff',
  [Network.KLAYTN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BAOBAB]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  // [Network.NEAR]: 'TODO',
  // [Network.NEAR_TESTNET]: 'TODO',
  // [Network.BORA]: '0x797115bcdbD85DC865222724eD67d473CE168962',
  // [Network.BORA_TESTNET]: '0x3d5cb6Be01f218CCA1Ec077028F2CFDC943A36f6',
};

export const erc20Decimal6ContractAddressMap: {
  [key: string]: string;
} = {
  [Network.ETHEREUM]: '',
  [Network.ROPSTEN]: '',
  [Network.SEPOLIA]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0xDF152758ce04EcEdfD9642c42b9Ce3090B68Ac2D',
  [Network.BNB_SMART_CHAIN]: '0xe63c2f4bdd0df2b18b0a4e0210d4b1e95a23dff9',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x21881fbff62d55b19b5ded57d8c5dc014da04ea2',
  [Network.KLAYTN]: '0xb3484b204c96b366e1004e94bc50fe637322da47',
  [Network.BAOBAB]: '0x4C253D0f5De4dAC61c5355aaA3EFe0872dfaDFfF',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  // [Network.NEAR]: 'TODO',
  // [Network.NEAR_TESTNET]: 'TODO',
  // [Network.BORA]: '0x231234a72478F99c3D1eE0f322bcBA259CAC9412',
  // [Network.BORA_TESTNET]: '0x231234a72478F99c3D1eE0f322bcBA259CAC9412',
};

const title = 'ERC20 Transaction';

function TransactionErc20() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom)!;
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [contractAddress, setContractAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [decimal, setDecimal] = useState('18');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [account.address]);

  useEffect(() => {
    // Set default contract address
    if (network) {
      setContractAddress(
        decimal === '18'
          ? erc20Decimal18ContractAddressMap[network]
          : erc20Decimal6ContractAddressMap[network]
      );
    }
  }, [decimal, network]);

  async function sendTransaction() {
    if (!amount) {
      alert('Please enter amount');
      return;
    }
    if (!decimal) {
      alert('Please select decimal');
      return;
    }
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }
    if (!receiverAddress) {
      alert('Please enter receiver address');
      return;
    }

    const provider = new providers.Web3Provider(face!.getEthLikeProvider(), 'any');
    const signer = await provider.getSigner();

    try {
      const transactionResponse = await signer.sendTransaction({
        to: contractAddress,
        value: '0x00',
        data: makeErc20Data('transfer', receiverAddress, utils.parseUnits(amount, Number(decimal))),
      });

      setTxHash(transactionResponse.hash);

      console.group('[Transaction Information]');
      console.log('Transaction response:', transactionResponse);
      console.log('Ropsten Link:', `${getExplorerUrl(network!, transactionResponse.hash)}`);

      const receipt = await transactionResponse.wait();
      console.log('Transaction receipt', receipt);
      console.groupEnd();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
    }
  }

  async function getBalance() {
    try {
      if (!contractAddress) {
        alert('Please enter contract address');
        return;
      }

      const provider = new providers.Web3Provider(face!.getEthLikeProvider(), 'any');
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(account.address);

      setBalance(utils.formatUnits(balance));
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.message);
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
  }
  if (!account.balance || !account.address) {
    return (
      <Box title={title}>
        <Message type="danger">
          <Text>You must log in and get account first.</Text>
        </Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <Picker title="Decimal" value={decimal} items={['18', '6']} onChange={setDecimal} />
      <TextField label={'Amount'} value={amount} onChange={setAmount} />
      <TextField label={'Contract Address'} value={contractAddress} onChange={setContractAddress} />
      <TextField label={'Receiver Address'} value={receiverAddress} onChange={setReceiverAddress} />
      <Button label="Transfer ERC20 token" onPress={sendTransaction} />

      {txHash && (
        <Message type="info">
          <Text>Hash: {txHash}</Text>
          <Text onPress={() => Linking.openURL(getExplorerUrl(network!, txHash))}>
            Explorer Link
          </Text>
        </Message>
      )}

      <Button label="Get ERC20 token balance" onPress={getBalance} />
      {balance && (
        <Message type="info">
          <Text>Balance: {balance}</Text>
        </Message>
      )}
    </Box>
  );
}

export default TransactionErc20;
