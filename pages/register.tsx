import { NextPage } from "next";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { pattern } from "../constants/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ResetModal } from "../components/ResetModal";
import { resetModalState, userState, usernameState } from "../lib/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

import { db } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";

const Register: NextPage = () => {
  const setUser = useSetRecoilState(userState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useRecoilState<any>(usernameState);
  const setOpenModal = useSetRecoilState(resetModalState);
  const router = useRouter();

  const handleRegisterEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // data.getはinputのname属性を指定する
    const userName =
      data.get("username") !== null ? data.get("username")!.toString() : "";
    const email =
      data.get("email") !== null ? data.get("email")!.toString() : "";
    const password =
      data.get("password") !== null ? data.get("password")!.toString() : "";

    if (userName === "") {
      alert("ユーザーネームが入力されていません");
      return;
    }
    if (userName.length >= 15) {
      alert("ユーザーネームは15文字以上入力できません");
      return;
    }
    if (email === "") {
      alert("メールアドレスが入力されていません");
      return;
    }
    if (!pattern.test(email)) {
      alert("メールアドレスに不正な値が入力されています");
      return;
    }
    if (password === "") {
      alert("パスワードが入力されていません");
      return;
    }
    if (password.length < 6) {
      alert("パスワードが6文字以上入力されていません");
      return;
    }
    if (password === password.slice(0, 1).repeat(password.length)) {
      alert("パスワードが全て同じ文字です");
      return;
    }

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
        const documentRef = doc(db, "users", authUser.user.uid);
        await setDoc(documentRef, {
          id: authUser.user.uid,
          name: authUser.user.displayName,
          email: authUser.user.email,
          postCode: "未設定",
          address: "未設定",
          phoneNumber: "未設定",
          dob: "未設定",
        });

        alert("サインアップが完了しました");
        setEmail("");
        setPassword("");
        setUser(authUser);
        router.push("./");
      })
      .catch((error) => {
        const errorCode = error.code;

        switch (errorCode) {
          case "auth/cancelled-popup-request":
          case "auth/popup-closed-by-user":
            return;
          case "auth/email-already-in-use":
            alert("このメールアドレスは使用されています");
            return;
          case "auth/invalid-email":
            alert("メールアドレスの形式が正しくありません");
            return;
          case "auth/weak-password":
            alert("パスワードは6文字以上にしてください");
            return;
          default:
            alert("登録に失敗しました。しばらく時間をおいて再度お試しください");
            return;
        }
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
              <input
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </li>
            <li className="form-item">
              <label>Email Address</label>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            <li className="form-item">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
          </ul>
          <button className="c-btn submit">
            <span className="mail">REGISTER</span>
          </button>
          <div className="loginSupport">
            <span
              className="loginSupport-item"
              onClick={() => setOpenModal(true)}
            >
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
