import { NextPage } from 'next';
import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ResetModal } from '../components/ResetModal';
import { resetModalState, userState } from '../lib/atoms';
import { useSetRecoilState } from 'recoil';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleLoginFormValidate, signInWithEmailAndPasswordValidate } from '../lib/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { useShoppingCart } from 'use-shopping-cart';

const Login: NextPage = () => {
  const { addItem } = useShoppingCart();
  const setUser = useSetRecoilState(userState);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const setResetModal = useSetRecoilState(resetModalState);
  const router = useRouter();

  const getCart = async (authUser: any) => {
    // ユーザーのcartコレクションのドキュメントをすべて取得して、addItemする。
    const collectionRef = collection(db, 'users', authUser.user.uid, 'cart');
    const q = query(collectionRef);
    const documents = await getDocs(q);
    if (documents.docs.length > 0) {
      documents.forEach((document) => {
        [...Array(document.data().quantity)].map(() =>
          addItem({
            id: document.data().id,
            productId: document.data().productId,
            name: document.data().name,
            price: document.data().price,
            currency: document.data().currency,
            image: document.data().image,
          })
        );
      });
    }
  };

  const handleLoginEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password, error } = await handleLoginFormValidate(event);
    // errorにtrueが返ってきたらサインインの処理に進まない
    if (error) return;

    signInWithEmailAndPassword(auth, email, password)
      // 引数に登録情報を受け取れる
      .then((authUser: any) => {
        alert('ログインに成功しました');
        getCart(authUser);
        setLoginEmail('');
        setLoginPassword('');
        setUser(authUser);
        router.push('./');
      })
      .catch((error) => {
        const errorCode = error.code;
        signInWithEmailAndPasswordValidate(errorCode);
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
