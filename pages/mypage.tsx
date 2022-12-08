import { NextPage } from "next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { ResetModal } from "../components/ResetModal";
import { userState, userDocState } from "../lib/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { signOut } from "firebase/auth";

import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Mypage: NextPage = () => {
  const [user, setUser] = useRecoilState(userState);
  const setUserDoc = useSetRecoilState<any>(userDocState);
  const [userData, setUserData] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const documentRef = doc(db, "users", user.user.uid);
      const document = await getDoc(documentRef);
      setUserData(document.data());
      setUserDoc(document.data());
    })();
  }, []);

  // authからログアウト
  const logout = (): Promise<void> => {
    return signOut(auth);
  };
  const handleLogout = (): void => {
    logout()
      .then(() => {
        setUser(null);
        router.push("./");
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <main className="l-form l-mypage">
        <h2 className="formTitle">MYPAGE</h2>
        <div className="l-row-btn">
          <button className="c-btn ja reverse" onClick={() => handleLogout()}>
            ログアウト
          </button>
          <Link href="./mypageEdit">
            <a className="c-btn ja">
              <span className="pencil">会員情報編集</span>
            </a>
          </Link>
        </div>
        <div className="memberInfo">
          <dl>
            <dt>お名前</dt>
            <dd>{userData.name}</dd>
          </dl>
          <dl>
            <dt>メールアドレス</dt>
            <dd>{userData.email}</dd>
          </dl>
          <dl>
            <dt>郵便番号</dt>
            <dd>{userData.postCode}</dd>
          </dl>
          <dl>
            <dt>住所</dt>
            <dd>{userData.address}</dd>
          </dl>
          <dl>
            <dt>電話番号</dt>
            <dd>{userData.phoneNumber}</dd>
          </dl>
          <dl>
            <dt>生年月日</dt>
            <dd>{userData.dob}</dd>
          </dl>
        </div>
        <section className="l-orderHistory">
          <h3 className="c-title--center">注文履歴</h3>
          <div className="memberInfo">
            <dl>
              <dt>注文ID</dt>
              <dd>********************</dd>
            </dl>
            <dl>
              <dt>注文日時</dt>
              <dd>********************</dd>
            </dl>
            <dl>
              <dt>発送予定日</dt>
              <dd>********************</dd>
            </dl>
            <dl>
              <dt>注文金額</dt>
              <dd>********************</dd>
            </dl>
          </div>
        </section>
      </main>
      <ResetModal />
    </>
  );
};
export default Mypage;
