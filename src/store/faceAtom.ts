import { atom } from 'recoil';
import { Face } from '@haechi-labs/face-react-native-sdk';

export const faceAtom = atom<Face | null>({
  key: 'faceAtom',
  default: null,
  dangerouslyAllowMutability: true,
});
