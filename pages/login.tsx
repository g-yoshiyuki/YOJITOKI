import { NextPage } from 'next';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { pattern } from '../constants/constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ResetModal } from '../components/ResetModal';
import { resetModalState, userState } from '../lib/atoms';
import { useSetRecoilState } from 'recoil';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleEmailAndPasswordValidate } from '../lib/auth';

const Login: NextPage = () => {
  const setUser = useSetRecoilState(userState);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const setResetModal = useSetRecoilState(resetModalState);
  const router = useRouter();

  const handleLoginEmail = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password, error } = handleEmailAndPasswordValidate(event);
    // errorにtrueが返ってきたらサインインの処理に進まない
    if (error) return;

    signInWithEmailAndPassword(auth, email, password)
      // 引数に登録情報を受け取れる
      .then((authUser: any) => {
        alert('ログインに成功しました');
        setLoginEmail('');
        setLoginPassword('');
        setUser(authUser);
        router.push('./');
      })
      .catch((error) => {
        const errorCode = error.code;

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
      });
  };

  return (
    <>
      <main className="l-form">
        <h2 className="formTitle">LOGIN</h2>

        <form className="" onSubmit={handleLoginEmail}>
          <ul className="form">
            <li className="form-item">
              <label>Email Address</label>
              <input name="loginEmail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </li>
            <li className="form-item">
              <label>Password</label>
              <input name="loginPassword" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </li>
          </ul>
          <button className="c-btn submit">
            <span className="mail">LOGIN</span>
          </button>
          <div className="loginSupport">
            <span className="loginSupport-item" onClick={() => setResetModal(true)}>
              パスワード再設定はこちら
            </span>
            <Link href="./register">
              <a className="loginSupport-item new">アカウント作成はこちら</a>
            </Link>
          </div>
        </form>
      </main>
      <ResetModal />
    </>
  );
};
export default Login;
