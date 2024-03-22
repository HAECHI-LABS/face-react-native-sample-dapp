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

export const erc20Decimal18ContractAddressMap = {
  [Network.ETHEREUM]: '0x8A904F0Fb443D62B6A2835483b087aBECF93a137',
  [Network.SEPOLIA]: '0xfCe04dd232006d0da001F6D54Bb5a7fC969dBc08',
  [Network.POLYGON]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.MUMBAI]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.BNB_SMART_CHAIN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x4c253d0f5de4dac61c5355aaa3efe0872dfadfff',
  [Network.TEZOS]: 'NOT SUPPORTED',
  [Network.GHOSTNET]: 'NOT SUPPORTED',
  [Network.KLAYTN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BAOBAB]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: '4TgNWnJcLbCGx1hVMCgFUsWjhuJQuxEMmh8vVapLCKVY',
  [Network.NEAR]: 'TODO',
  [Network.NEAR_TESTNET]: 'facewallet.testnet',
  [Network.BORA]: '0x5de4eB478160972e6E5250Ee6EF74Eb7e73e8867',
  [Network.BORA_TESTNET]: '0xb6FCfC6c65Be58E2f59530CB357bfeA084C43201',
  [Network.APTOS]: 'TODO',
  [Network.APTOS_TESTNET]: 'TODO',
  [Network.MEVERSE]: 'TODO',
  [Network.MEVERSE_TESTNET]: '0x63C1664c1Ee107D762C7ed7517Ca1cD25bc33C0b',
  [Network.PSM]: 'TODO',
  [Network.PSM_TESTNET]: '0xe4caf34c99a40d7E4Aa512Ad80f1D9aeF8ef0d01',
  [Network.PSM_TESTNET_TEST]: '0xe4caf34c99a40d7E4Aa512Ad80f1D9aeF8ef0d01',
  [Network.PSM_TESTNET_DEV]: '0xe4caf34c99a40d7E4Aa512Ad80f1D9aeF8ef0d01',
  [Network.HOME_VERSE]: '0x614acBDC097E4bFa830996505832Dc155A260dc1',
  [Network.HOME_VERSE_TESTNET]: '0x49d1d2C07313e6a88F7710937C3415f43EAf8337',
  [Network.YOOLDO_VERSE]: '0xccb2c886F9e8E96d69B419aF7607ad935284dDc7',
  [Network.YOOLDO_VERSE_TESTNET]: '0xab3E0c68E867F1C81A6660960FdfcF53402b33BF',
  [Network.SAND_VERSE]: '0xccb2c886F9e8E96d69B419aF7607ad935284dDc7',
  // 새로운 스마트 컨트랙트를 배포 못함 https://docs.oasys.games/docs/architecture/hub-layer/hub-layer#smart-contract
  [Network.OASYS]: 'TODO',
  [Network.OASYS_TESTNET]: '0x646ea0705805AE57C3500d6EC46BF982Fa88ed83',
  [Network.MCH_VERSE]: 'TODO',
  [Network.MCH_VERSE_TESTNET]: '0x63C1664c1Ee107D762C7ed7517Ca1cD25bc33C0b',
  [Network.HEDERA]: 'TODO',
  [Network.HEDERA_TESTNET]: '0xf36c894368d968301dac167a031ebdf1f3c55b23',
  [Network.DEFI_VERSE]: 'TODO',
  [Network.DEFI_VERSE_TESTNET]: '0xf4Fd699E9EfD60dFbB5a3127fdD05e54342E7f60',
  [Network.KROMA]: 'TODO',
  [Network.KROMA_SEPOLIA]: '0x697F935C05466c52237e481D97C369F70f8FbaDc',
  [Network.LINEA]: '0xE63c2F4bDD0df2B18b0A4E0210d4b1e95a23dFf9',
  [Network.LINEA_GOERLI]: '0xab3E0c68E867F1C81A6660960FdfcF53402b33BF',
  // [Network.ASM]: 'TODO',
  [Network.ASM_QA]: '0x7d2F1bF6a8d198ff17aA6D3e03a3C10E3AdCa71f',
  [Network.ASM_TEST]: '0xccb2c886F9e8E96d69B419aF7607ad935284dDc7',
  [Network.ASM_DEV]: '0x7d2F1bF6a8d198ff17aA6D3e03a3C10E3AdCa71f',
  [Network.ASM_STAGE]: '0xab3E0c68E867F1C81A6660960FdfcF53402b33BF',
};

export const erc20Decimal6ContractAddressMap = {
  [Network.ETHEREUM]: '',
  [Network.SEPOLIA]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.POLYGON]: '',
  [Network.MUMBAI]: '0xDF152758ce04EcEdfD9642c42b9Ce3090B68Ac2D',
  [Network.BNB_SMART_CHAIN]: '0xe63c2f4bdd0df2b18b0a4e0210d4b1e95a23dff9',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x21881fbff62d55b19b5ded57d8c5dc014da04ea2',
  [Network.TEZOS]: 'NOT SUPPORTED',
  [Network.GHOSTNET]: 'NOT SUPPORTED',
  [Network.KLAYTN]: '0xb3484b204c96b366e1004e94bc50fe637322da47',
  [Network.BAOBAB]: '0x4C253D0f5De4dAC61c5355aaA3EFe0872dfaDFfF',
  [Network.SOLANA]: 'TODO',
  [Network.SOLANA_DEVNET]: 'TODO',
  [Network.NEAR]: 'TODO',
  [Network.NEAR_TESTNET]: 'TODO',
  [Network.BORA]: '0x231234a72478F99c3D1eE0f322bcBA259CAC9412',
  [Network.BORA_TESTNET]: '0x231234a72478F99c3D1eE0f322bcBA259CAC9412',
  [Network.APTOS]: 'TODO',
  [Network.APTOS_TESTNET]: 'TODO',
  [Network.MEVERSE]: '0xab3E0c68E867F1C81A6660960FdfcF53402b33BF',
  [Network.MEVERSE_TESTNET]: '0x72c943436A9218C72836e7eC0E241b763869b417',
  [Network.PSM]: 'TODO',
  [Network.PSM_TESTNET]: '0x86B3722B6604C2510e5B5Dc55c8cFB95ae087c9d',
  [Network.PSM_TESTNET_TEST]: '0x86B3722B6604C2510e5B5Dc55c8cFB95ae087c9d',
  [Network.PSM_TESTNET_DEV]: '0x86B3722B6604C2510e5B5Dc55c8cFB95ae087c9d',
  [Network.HOME_VERSE]: '0xAc99E0BB07687A65A0c4EDE872F096a9E1688A40',
  [Network.HOME_VERSE_TESTNET]: '0x4E6BdF2B2c7D3692f7aCaa7b67209976f03e4A05',
  [Network.YOOLDO_VERSE]: '0x7d2F1bF6a8d198ff17aA6D3e03a3C10E3AdCa71f',
  [Network.YOOLDO_VERSE_TESTNET]: '0xA2fAB648F2CFd5ceA88492808214fCE0CCA15b5E',
  [Network.SAND_VERSE]: '0xb1702eFB3E50d7cb02B82b72eFE020FA011921a5',
  // OASYS HUB 새로운 스마트 컨트랙트를 배포 못함 https://docs.oasys.games/docs/architecture/hub-layer/hub-layer#smart-contract
  [Network.OASYS]: 'TODO',
  [Network.OASYS_TESTNET]: '0x5de4eB478160972e6E5250Ee6EF74Eb7e73e8867',
  [Network.MCH_VERSE]: 'TODO',
  [Network.MCH_VERSE_TESTNET]: '0x72c943436A9218C72836e7eC0E241b763869b417',
  [Network.HEDERA]: 'TODO',
  [Network.HEDERA_TESTNET]: '0xe6F667F97ED03C35Ecab0e5Ae9Fe4C55D57FEE73',
  [Network.DEFI_VERSE]: 'TODO',
  [Network.DEFI_VERSE_TESTNET]: '0x4fD23Df759732Ec64F4d898971efFc34b4c56d78',
  [Network.KROMA]: 'TODO',
  [Network.KROMA_SEPOLIA]: '0x04cd9806dD9B03ce5cc493A60e0A5e4Ae3108C4b',
  [Network.LINEA]: 'TODO',
  [Network.LINEA_GOERLI]: '0xA2fAB648F2CFd5ceA88492808214fCE0CCA15b5E',
  // [Network.ASM]: 'TODO',
  [Network.ASM_QA]: '0xccb2c886F9e8E96d69B419aF7607ad935284dDc7',
  [Network.ASM_TEST]: '0x7d2F1bF6a8d198ff17aA6D3e03a3C10E3AdCa71f',
  [Network.ASM_DEV]: '0xcd811021316c19891c47ae6a91E74ecC5FEf9295',
  [Network.ASM_STAGE]: '0xA2fAB648F2CFd5ceA88492808214fCE0CCA15b5E',
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
