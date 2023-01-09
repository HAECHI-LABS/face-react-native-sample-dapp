import 'react-native-get-random-values';
import { StyleSheet, ScrollView } from 'react-native';

import { View, Image } from 'react-native-ui-lib';
import { RecoilRoot } from 'recoil';
import LoginWithFace from './src/components/LoginWithFace';
import TransactionPlatformCoin from './src/components/TransactionPlatformCoin';
import ConnectNetwork from './src/components/ConnectNetwork';
import TransactionErc20 from './src/components/TransactionErc20';
import TransactionErc721 from './src/components/TransactionErc721';
import TransactionErc1155 from './src/components/TransactionErc1155';
import SignMessage from './src/components/SignMessage';
import WalletHome from './src/components/WalletHome';

export default function App() {
  return (
    <RecoilRoot>
      <View useSafeArea style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <ConnectNetwork />
          <LoginWithFace />
          <WalletHome />
          <TransactionPlatformCoin />
          <TransactionErc20 />
          <TransactionErc721 />
          <TransactionErc1155 />
          <SignMessage />
        </ScrollView>
      </View>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#fafafa',
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 20,
    paddingTop: 5,
  },
  logo: {
    width: '45%',
    resizeMode: 'contain',
  },
});
