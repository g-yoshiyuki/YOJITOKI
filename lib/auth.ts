import { pattern } from '../constants/constants';

export const handleEmailAndPasswordValidate = (event: React.FormEvent<HTMLFormElement>): any => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  // console.log(data);
  // data.getはinputのname属性を指定する
  const email = data.get('loginEmail') !== null ? data.get('loginEmail')!.toString() : '';
  const password = data.get('loginPassword') !== null ? data.get('loginPassword')!.toString() : '';
  const error = false;

  if (email === '') {
    alert('メールアドレスが入力されていません');
    const error = true;
    return { email, password, error };
  }
  if (!pattern.test(email)) {
    alert('メールアドレスに不正な値が入力されています');
    const error = true;
    return { email, password, error };
  }
  if (password === '') {
    alert('パスワードが入力されていません');
    const error = true;
    return { email, password, error };
  }
  if (password.length < 6) {
    alert('パスワードが6文字以上入力されていません');
    const error = true;
    return { email, password, error };
  }
  if (password === password.slice(0, 1).repeat(password.length)) {
    alert('パスワードが全て同じ文字です');
    const error = true;
    return { email, password, error };
  }
  return { email, password, error };
};
