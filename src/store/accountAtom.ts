import { atom } from 'recoil';
import { BigNumber } from 'ethers';

type Account = {
  address?: string;
  balance?: BigNumber;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
};

export const accountAtom = atom<Account>({
  key: 'accountAtom',
  default: {},
});
