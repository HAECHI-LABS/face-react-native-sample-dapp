import { ScrollView, StyleSheet } from 'react-native';

import React from 'react';
import { Image, View } from 'react-native-ui-lib';
import { RecoilRoot } from 'recoil';
import BoraPortal from './src/components/BoraPortal';
import ConnectNetwork from './src/components/ConnectNetwork';
import LoginWithFace from './src/components/LoginWithFace';
import SignMessage from './src/components/SignMessage';
import TransactionErc1155 from './src/components/TransactionErc1155';
import TransactionErc20 from './src/components/TransactionErc20';
import TransactionErc721 from './src/components/TransactionErc721';
import TransactionPlatformCoin from './src/components/TransactionPlatformCoin';
import WalletHome from './src/components/WalletHome';
import TransactionContractCall from './src/components/TransactionContractCall';

export default function App() {
  return (
    <RecoilRoot>
      <View useSafeArea style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <ConnectNetwork />
          <LoginWithFace />
          <WalletHome />
          <BoraPortal />
          <TransactionPlatformCoin />
          <TransactionErc20 />
          <TransactionErc721 />
          <TransactionErc1155 />
          <TransactionContractCall />
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
