import { NextPage } from 'next';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ResetModal } from '../components/ResetModal';
import { resetModalState, userState, usernameState } from '../lib/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { db } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPasswordValidate, handleRegisterFormValidate } from '../lib/auth';

const Register: NextPage = () => {
  const setUser = useSetRecoilState(userState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useRecoilState<any>(usernameState);
  const setOpenModal = useSetRecoilState(resetModalState);
  const router = useRouter();

  const handleRegisterEmail = (event: React.FormEvent<HTMLFormElement>) => {
    const { userName, email, password, error } = handleRegisterFormValidate(event);
    // errorにtrueが返ってきたらサインインの処理に進まない
    if (error) return;

    createUserWithEmailAndPassword(auth, email, password)
      // 引数に登録情報を受け取れる
      // awaitを実行することでfirestoreに反映される。
      .then(async (authUser: any) => {
        if (authUser.user) {
          await updateProfile(authUser.user, {
            displayName: userName,
          });
        }

        // uidをdocumentIdにセットしてdocumentを作成
        const documentRef = doc(db, 'users', authUser.user.uid);
        await setDoc(documentRef, {
          id: authUser.user.uid,
          name: authUser.user.displayName,
          email: authUser.user.email,
          postCode: '未設定',
          address: '未設定',
          phoneNumber: '未設定',
          dob: '未設定',
        });

        alert('サインアップが完了しました');
        setUsername('');
        setEmail('');
        setPassword('');
        setUser(authUser);
        router.push('./');
      })
      .catch((error) => {
        const errorCode = error.code;
        createUserWithEmailAndPasswordValidate(errorCode);
      });
  };

  return (
    <>
      <main className="l-form">
        <form className="" onSubmit={handleRegisterEmail}>
          <span className="formTitle">REGISTER</span>
          <ul className="form">
            <li className="form-item">
              <label>Username</label>
              <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </li>
            <li className="form-item">
              <label>Email Address</label>
              <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </li>
            <li className="form-item">
              <label>Password</label>
              <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </li>
          </ul>
          <button className="c-btn submit">
            <span className="mail">REGISTER</span>
          </button>
          <div className="loginSupport">
            <span className="loginSupport-item" onClick={() => setOpenModal(true)}>
              パスワード再設定はこちら
            </span>
            <Link href="./login">
              <a className="loginSupport-item">ログインページへ戻る</a>
            </Link>
          </div>
        </form>
      </main>
      <ResetModal />
    </>
  );
};
export default Register;
