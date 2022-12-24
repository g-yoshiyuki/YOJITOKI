import { NextPage } from 'next';
import Link from 'next/link';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { ResetModal } from '../components/ResetModal';
import { userState, userDocState } from '../lib/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { signOut } from 'firebase/auth';

const Mypage: NextPage = () => {
  const setUser = useSetRecoilState(userState);
  const userDoc = useRecoilValue<any>(userDocState);
  const router = useRouter();

  // authからログアウト
  const logout = (): Promise<void> => {
    return signOut(auth);
  };
  const handleLogout = (): void => {
    logout()
      .then(() => {
        setUser(null);
        router.push('./');
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
            <dd>{userDoc.name}</dd>
          </dl>
          <dl>
            <dt>メールアドレス</dt>
            <dd>{userDoc.email}</dd>
          </dl>
          <dl>
            <dt>郵便番号</dt>
            <dd>{userDoc.postCode}</dd>
          </dl>
          <dl>
            <dt>住所</dt>
            <dd>{userDoc.address}</dd>
          </dl>
          <dl>
            <dt>電話番号</dt>
            <dd>{userDoc.phoneNumber}</dd>
          </dl>
          <dl>
            <dt>生年月日</dt>
            <dd>{userDoc.dob}</dd>
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
