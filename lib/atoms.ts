import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: typeof window === 'undefined' ? undefined : sessionStorage,
});

// 現在のユーザー
export const userState = atom({
  key: 'user',
  default: null,
  dangerouslyAllowMutability: true,
  effects_UNSTABLE: [persistAtom],
});

export const editIdState = atom({
  key: 'editId',
  default: '',
});

export const usernameState = atom({
  key: 'username',
  default: '',
});

export const loginModalState = atom({
  key: 'loginModal',
  default: false,
});
export const resetModalState = atom({
  key: 'resetModal',
  default: false,
});
export const userDocState = atom({
  key: 'userDoc',
  default: [],
});
export const loginPasswordState = atom({
  key: 'loginPassword',
  default: '',
});
export const loginEmailState = atom({
  key: 'loginEmail',
  default: '',
});
export const stripeProductState = atom({
  key: 'stripeProduct',
  default: '',
});
export const buttonClickState = atom({
  key: 'buttonClick',
  default: false,
});
export const paymentsDataState = atom({
  key: 'paymentsData',
  default: [],
});
