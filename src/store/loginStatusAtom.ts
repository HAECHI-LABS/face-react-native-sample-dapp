import { atom } from 'recoil';

export const loginStatusAtom = atom<boolean>({
  key: 'loginStatusAtom',
  default: false,
});
