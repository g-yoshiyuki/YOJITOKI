import { NextPage } from 'next';
import Link from 'next/link';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';
import { ResetModal } from '../components/ResetModal';
import { userState, userDocState, paymentsDataState } from '../lib/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { signOut } from 'firebase/auth';
import { useEffect} from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Mypage: NextPage = () => {
  const [user, setUser] = useRecoilState(userState);
  const userDoc = useRecoilValue<any>(userDocState);
  const [paymentsData, setPaymentsData] = useRecoilState<any>(paymentsDataState);
  const router = useRouter();

  useEffect(() => {
    const collectionRef = collection(db, 'users', user.user.uid, 'payment');
    const q = query(
      collectionRef,
      // 新しい注文を上に表示する
      orderBy('timestamp', 'desc')
    );

    //webhookでpaymentコレクションにdocumentが追加されたら実行
    const unSub = onSnapshot(q, (snapshot) => {
      setPaymentsData(
        // snapshot.docsで、postsの中にあるドキュメントをすべて取得
        snapshot.docs.map((doc) => ({
          timestamp: new Date(doc.data().timestamp?.toDate()).toLocaleString(),
          url: doc.data().url,
          data: doc.data().data.map((product: any) => ({
            price: product.amount_total,
            id: product.id,
            name: product.description,
            quantity: product.quantity,
          })),
        }))
      );
    });
    return () => {
      unSub();
    };
  }, []);
  console.log(paymentsData);
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
          {paymentsData.length !== 0 ? (
            <>
              {paymentsData.map((paymentData: any) => {
                return (
                  <div className="memberInfo payment" key={paymentData.url}>
                    <dl className="l-timestamp">
                      <dt>注文日時</dt>
                      <dd>{paymentData.timestamp}</dd>
                    </dl>
                    {paymentData.data.map((product: any) => {
                      return (
                        <div className="memberInfoInner" key={product.id}>
                          <dl>
                            <dt>注文ID</dt>
                            <dd>{product.id}</dd>
                          </dl>
                          <dl>
                            <dt>商品名</dt>
                            <dd>{product.name}</dd>
                          </dl>
                          <dl>
                            <dt>注文数</dt>
                            <dd>{product.quantity}</dd>
                          </dl>
                          <dl>
                            <dt>注文金額</dt>
                            <dd>{product.price}</dd>
                          </dl>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-center">※注文履歴はありません</p>
          )}
        </section>
      </main>
      <ResetModal />
    </>
  );
};
export default Mypage;

// [
//   {
//     timestamp: '2022-12-28T09:25:30.160Z',
//     data: [
//       {
//         price: 1100,
//         id: 'li_1MJvs3GcRCs6uTswatIlYx0i',
//         name: 'マグカップ_2',
//         quantity: 1,
//       },
//     ],
//   },
//   {
//     timestamp: '2022-12-28T09:14:51.483Z',
//     data: [
//       {
//         price: 5500,
//         id: 'li_1MJviHGcRCs6uTswolnjPUE6',
//         name: '花瓶_2',
//         quantity: 1,
//       },
//     ],
//   },
// ];

{
  /* <section className="l-orderHistory">
          <h3 className="c-title--center">注文履歴</h3>
          {paymentsData.length !== 0 ? (
            <>
              {paymentsData.map((payment: any) => {
                {
                  payment.data.map((product: any) => {
                    return (
                      <div className="memberInfo" key={product.id}>
                        <div className="memberInfoInner">
                          <dl>
                            <dt>注文日時</dt>
                            <dd>{product.timestamp}</dd>
                          </dl>
                          <dl>
                            <dt>注文ID</dt>
                            <dd>{product.id}</dd>
                          </dl>
                          <dl>
                            <dt>商品名</dt>
                            <dd>{product.name}</dd>
                          </dl>
                          <dl>
                            <dt>注文数</dt>
                            <dd>{product.quantity}</dd>
                          </dl>
                          <dl>
                            <dt>注文金額</dt>
                            <dd>{product.price}</dd>
                          </dl>
                        </div>
                      </div>
                    );
                  });
                }
              })}
            </>
          ) : (
            <p className="text-center">※注文履歴はありません</p>
          )}
        </section> */
}
