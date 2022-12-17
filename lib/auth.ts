import { pattern } from '../constants/constants';

// ログインフォームバリデート
export const handleLoginFormValidate = (event: React.FormEvent<HTMLFormElement>): any => {
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
// ログインシステムバリデート
export const signInWithEmailAndPasswordValidate = (errorCode: any) => {
  switch (errorCode) {
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      return;
    case 'auth/email-already-in-use':
      alert('このメールアドレスは使用されています');
      return;
    case 'auth/invalid-email':
      alert('メールアドレスの形式が正しくありません');
      return;
    case 'auth/user-disabled':
      alert('サービスの利用が停止されています');
      return;
    case 'auth/user-not-found':
      alert('メールアドレスまたはパスワードが違います');
      return;
    case 'auth/user-mismatch':
      alert('認証されているユーザーと異なるアカウントが選択されました');
      return;
    case 'auth/weak-password':
      alert('パスワードは6文字以上にしてください');
      return;
    case 'auth/wrong-password':
      alert('メールアドレスまたはパスワードが違います');
      return;
    case 'auth/popup-blocked':
      alert('認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください');
      return;
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/auth-domain-config-required':
    case 'auth/operation-not-allowed':
    case 'auth/unauthorized-domain':
      alert('現在この認証方法はご利用頂けません');
      return;
    case 'auth/requires-recent-login':
      alert('認証の有効期限が切れています');
      return;
    default:
      alert('認証に失敗しました。しばらく時間をおいて再度お試しください');
      return;
  }
};
// レジスターフォームバリデート
export const handleRegisterFormValidate = (event: React.FormEvent<HTMLFormElement>): any => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  // data.getはinputのname属性を指定する
  const userName = data.get('username') !== null ? data.get('username')!.toString() : '';
  const email = data.get('email') !== null ? data.get('email')!.toString() : '';
  const password = data.get('password') !== null ? data.get('password')!.toString() : '';
  const error = false;

  if (userName === '') {
    alert('ユーザーネームが入力されていません');
    const error = true;
    return { userName, email, password, error };
  }
  if (userName.length >= 15) {
    alert('ユーザーネームは15文字以上入力できません');
    const error = true;
    return { userName, email, password, error };
  }
  if (email === '') {
    alert('メールアドレスが入力されていません');
    const error = true;
    return { userName, email, password, error };
  }
  if (!pattern.test(email)) {
    alert('メールアドレスに不正な値が入力されています');
    const error = true;
    return { userName, email, password, error };
  }
  if (password === '') {
    alert('パスワードが入力されていません');
    const error = true;
    return { userName, email, password, error };
  }
  if (password.length < 6) {
    alert('パスワードが6文字以上入力されていません');
    const error = true;
    return { userName, email, password, error };
  }
  if (password === password.slice(0, 1).repeat(password.length)) {
    alert('パスワードが全て同じ文字です');
    const error = true;
    return { userName, email, password, error };
  }
  return { userName, email, password, error };
};
// レジスターシステムバリデート
export const createUserWithEmailAndPasswordValidate = (errorCode: any) => {
  switch (errorCode) {
    case 'auth/cancelled-popup-request':
    case 'auth/popup-closed-by-user':
      return;
    case 'auth/email-already-in-use':
      alert('このメールアドレスは使用されています');
      return;
    case 'auth/invalid-email':
      alert('メールアドレスの形式が正しくありません');
      return;
    case 'auth/weak-password':
      alert('パスワードは6文字以上にしてください');
      return;
    default:
      alert('登録に失敗しました。しばらく時間をおいて再度お試しください');
      return;
  }
};
