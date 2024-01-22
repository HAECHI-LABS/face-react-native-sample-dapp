import { Env } from '@haechi-labs/face-types';
import { atom } from 'recoil';

export const envAtom = atom<Env>({
  key: 'envAtom',
  default: Env.StageTest,
});
