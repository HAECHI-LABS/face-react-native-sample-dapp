import { Network } from '@haechi-labs/face-types';
import { atom } from 'recoil';

export const networkAtom = atom<Network>({
  key: 'networkAtom',
  default: Network.ETHEREUM,
});
